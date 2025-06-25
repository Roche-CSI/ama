from asyncio.log import logger
import os
from cached_property import cached_property
import hashlib

from amapy_plugin_minio.transporter.minio_hash import *
from amapy_pluggy.storage import BlobStoreURL
from amapy_pluggy.storage.transporter import TransportResource
from amapy_utils.common import exceptions
from amapy_utils.utils.file_utils import FileUtils
from amapy_utils.utils import aws_hash

def safe_bytes_etags(file_bytes, etag):
    """
    A safer wrapper for aws_hash.bytes_etags that handles single-part etags.
    """
    # Remove quotes if present
    if etag.startswith('"') and etag.endswith('"'):
        etag = etag[1:-1]
    
    # Check if this is a multipart etag
    if '-' in etag:
        # Use the original function for multipart etags
        return aws_hash.bytes_etags(file_bytes=file_bytes, etag=etag)
    else:
        # For single-part etags, just calculate the MD5 hash
        file_hash = hashlib.md5(file_bytes).hexdigest()
        return "etag", [file_hash]

class MinioTransportResource(TransportResource):
    @classmethod
    def from_transport_resource(cls, res: TransportResource):
        return cls(src=res.src, dst=res.dst, hash=res.src_hash, callback=res.callback)

class MinioUploadResource(MinioTransportResource):
    @cached_property
    def dst_url(self) -> BlobStoreURL:
        return BlobStoreURL(url=self.dst)

def safe_file_etags(filepath, etag):
    """
    A safer wrapper for aws_hash.file_etags that handles single-part etags.
    """
    # Remove quotes if present
    if etag.startswith('"') and etag.endswith('"'):
        etag = etag[1:-1]
    
    if '-' in etag:
        try:
            return aws_hash.file_etags(filepath=filepath, etag=etag)
        except IndexError:
            # If there's an index error, fall back to simple MD5
            import hashlib
            with open(filepath, 'rb') as f:
                file_hash = hashlib.md5(f.read()).hexdigest()
            return "etag", [file_hash]
    else:
        # For single-part etags, just calculate the MD5 hash
        with open(filepath, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        return "etag", [file_hash]

class MinioDownloadResource(MinioTransportResource):
    def __init__(self, src: str, dst: str, hash: tuple = None, callback=None, **kwargs):
        super().__init__(src=src, dst=dst, hash=hash, callback=callback, **kwargs)
        self._dst_hash = None
    
    @cached_property
    def src_url(self) -> BlobStoreURL:
        return BlobStoreURL(url=self.src)

    def compute_dest_hash(self, hash_type: str) -> tuple:
        """Computes the destination hash."""
        if hash_type == "etag":
            if not os.path.exists(self.dst):
                return "etag", []
            
            # Get the etag value from src_hash
            etag_value = self.src_hash[1]
            etag_value = normalize_etag(etag_value)
            
            if '-' in etag_value:                
                try:
                    _, part_count = parse_multipart_etag(etag_value)
                    possible_etags = calculate_possible_etags(self.dst, part_count)
                    return "etag", possible_etags
                except ValueError as e:
                    logger.error(f"Error parsing multipart etag: {e}")
                    return "etag", []
            else:
                file_md5 = calculate_file_md5(self.dst)
                return "etag", [file_md5]
        else:
            return super().compute_dest_hash(hash_type=hash_type)

    def verify_checksum(self) -> bool:
        """Verifies the checksum after download."""
        if not self.src_hash:
            return False
        
        src_hash_type, src_hash_val = self.src_hash
        
        # For etag, use specialized verification
        if src_hash_type == "etag":
            if not os.path.exists(self.dst):
                return False
            
            return verify_etag(self.dst, src_hash_val)
        
        # For other hash types, use the standard verification
        return super().verify_checksum()

    def on_transfer_complete(self, *args) -> None:
        """Handles the completion of the transfer."""
        # first, make sure the file is downloaded
        if not os.path.exists(self.dst):
            raise exceptions.ResourceDownloadError(f"failed to downloaded: {self.src}")

        # then, compute the hash of the downloaded file
        if self.src_hash:
            src_hash_type, src_hash_val = self.src_hash
            if src_hash_type == "etag":
                self.dst_hash = safe_bytes_etags(file_bytes=args[-1], etag=src_hash_val)
            else:
                self.dst_hash = FileUtils.bytes_hash(file_bytes=args[-1], hash_type=src_hash_type)
        super().on_transfer_complete(*args[:-1])

            
class MinioCopyResource(MinioTransportResource):
    def __init__(self,
                 src: str,
                 dst: str,
                 hash: tuple = None,
                 callback=None,
                 **kwargs):
        """Initializes a MinioCopyResource instance.

        Parameters
        ----------
        src : str
            The source URL.
        dst : str
            The destination URL.
        hash : tuple, optional
            The hash.
        callback : function, optional
            The callback function.
        **kwargs
            Arbitrary keyword arguments.
        """
        super().__init__(src=src,
                         dst=dst,
                         hash=hash,
                         callback=callback)
        self.size = kwargs.get("size")
        if kwargs.get("blob"):  # asset cp command (remote copy)
            self.blob = kwargs.get("blob")
            self.size = self.blob.size
        if not self.size:
            raise exceptions.AssetException("Size is required for remote cloning.")

    @cached_property
    def src_url(self) -> BlobStoreURL:
        return BlobStoreURL(url=self.src)

    @cached_property
    def dst_url(self) -> BlobStoreURL:
        return BlobStoreURL(url=self.dst)

    @cached_property
    def multipart_size(self):
        """Returns the size of the multipart.

        Returns
        -------
        int
            The size of the multipart.
        """
        return self.blob.multipart_size if hasattr(self, "blob") else 8 * 1024 * 1024  # 8MB default