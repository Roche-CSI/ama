from typing import Any
from amapy_pluggy.storage import BlobData
from amapy_pluggy.storage import BlobStoreURL


class MinioBlob(BlobData):
    """Class to handle MinIO blob data."""
    _minio_obj = None
    _multipart_size = None

    def initialize(self, data: Any, url_object: BlobStoreURL):
        """Initialize the MinioBlob object with data from a MinIO object."""
        self._minio_obj = data
        self.name = data.object_name
        self.size = data.size
        self.host = url_object.host
        self.bucket = url_object.bucket
        self.url = url_object.url_for_blob(host=self.host, bucket=self.bucket, name=self.name)
        
        self.hashes = {}
        
        # Handle etag - store it as etag
        if hasattr(data, 'etag') and data.etag:
            self.hashes["etag"] = data.etag
            
            # For single-part uploads, also store as md5
            etag = data.etag
            if etag.startswith('"') and etag.endswith('"'):
                etag = etag[1:-1]
            
            if '-' not in etag:
                self.hashes["md5"] = etag
            elif '-' in etag:
                parts = etag.split('-')
                if len(parts) == 2 and parts[1] == '1':  # Single part despite the format
                    self.hashes["md5"] = parts[0]
                    self._multipart_size = self.size
        
        from amapy_utils.utils.file_utils import FileUtils
        self.content_type = FileUtils.mime_type(self.name)

    def get_hash(self):
        """Get the hash for verification.
        
        Return etag if available, otherwise fall back to md5.
        """
        # Prefer etag for MinIO objects
        if "etag" in self.hashes:
            return ("etag", self.hashes["etag"])
        
        if "md5" in self.hashes:
            return ("md5", self.hashes["md5"])
        
        return None
    
    @property
    def is_file(self):
        """Check if the blob is a file."""
        return bool(self.content_type != 'application/x-directory')
    
    @property
    def multipart_size(self) -> int:
        """Get the part size of the multipart upload."""
        if self.is_multipart and not self._multipart_size:
            # Default to 8MB for multipart size if not known
            return 8 * 1024 * 1024
        return self._multipart_size
    
    @multipart_size.setter
    def multipart_size(self, size: int):
        """Set the part size of the multipart upload."""
        self._multipart_size = size
    
    @property
    def is_multipart(self) -> bool:
        """Check if the blob is a multipart upload."""
        return bool('-' in self.hashes.get("etag", ""))
    
    def get_hash_preferences(self) -> list:
        """Get hash preferences for the blob."""
        # Include both md5 and etag in preferences
        return [*super().get_hash_preferences(), "etag"]

    def _initialize_from_dict(self, data: dict):
        """
        Initialize the MinioBlob object from a dictionary.
        
        Parameters
        ----------
        data : dict
            The dictionary containing the blob data.
        """
        self.bucket = data.get("bucket")
        self.hashes = data.get("hashes", {})
        self.host = data.get("host")
        self.name = data.get("name")
        self.path_in_asset = data.get("path_in_asset")
        self.size = data.get("size")
        self.url = data.get("url")
        self.content_type = data.get("content_type")


    @property
    def is_multipart(self) -> bool:
        """
        Check if the blob is a multipart upload.
        
        Returns
        -------
        bool
            True if the blob is a multipart upload, False otherwise.
        """
        return bool('-' in self.hashes.get("etag", ""))

    def _parse_etag(self, etag: str) -> list:
        """
        Parse the ETag of the blob if it is multipart.
        
        Parameters
        ----------
        etag : str
            The ETag of the blob.
            
        Returns
        -------
        list
            A list containing the ETag and the number of parts in the upload.
        """
        # Remove extra quotes if present
        if etag.startswith('"') and etag.endswith('"'):
            etag = etag[1:-1]
        return etag.split("-")

    def compute_hash(self) -> tuple:
        """
        Compute the hash of the blob.
        
        Returns
        -------
        tuple
            A tuple containing the hash type and hash value.
            
        Raises
        ------
        NotImplementedError
            This method is not implemented.
        """
        raise NotImplementedError