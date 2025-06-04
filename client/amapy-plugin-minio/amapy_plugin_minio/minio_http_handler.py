from functools import cached_property
from minio import Minio
from amapy_pluggy.storage import StorageData, StorageURL, BlobStoreURL
from amapy_plugin_minio.minio_transporter import MinioTransporter
from amapy_plugin_minio.minio_blob import MinioBlob
import logging
from typing import Union

logger = logging.getLogger(__name__)

class MinioHttpHandler:
    """MinIO Http Handler class for handling MinIO operations."""
    
    def __init__(self, credentials: dict = None):
        self.cred = credentials
    
    @cached_property
    def credentials(self) -> dict:
        """Returns MinIO credentials."""
        return self.cred or {}
    
    @cached_property
    def client(self):
        """Returns a MinIO client."""
        endpoint = self.credentials.get('endpoint', 'localhost:9000')
        access_key = self.credentials.get('access_key', 'minioadmin')
        secret_key = self.credentials.get('secret_key', 'minioadmin')
        secure = self.credentials.get('secure', False)
        
        if isinstance(secure, str):
            secure = secure.lower() == 'true'
        
        return Minio(
            endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=secure
        )
    
    def allows_object_add(self):
        """Checks if object addition is allowed."""
        return True
    
    def allows_proxy(self):
        """Checks if proxy is allowed."""
        return True
    
    def get_transporter(self):
        """Returns a MinIO transporter."""
        return MinioTransporter.shared(
            credentials=self.credentials,
            prefixes=["minio://"]
        )
    
    def get_storage_url(self, url_string: str, ignore: str = None) -> StorageURL:
        """Returns a StorageURL for the given URL string."""
        return BlobStoreURL(url=url_string, ignore=ignore)
    
    def get_blob(self, url_string: str) -> StorageData:
        """Returns a StorageData for the given URL string."""
        url = BlobStoreURL(url=url_string)
        
        try:
            stat = self.client.stat_object(url.bucket, url.path)
            
            # Create a MinioObject with the stat data
            minio_obj = type('MinioObject', (), {
                'object_name': url.path,
                'size': stat.size,
                'last_modified': stat.last_modified,
                'etag': getattr(stat, 'etag', None)
            })
            
            # Return a MinioBlob instance
            return MinioBlob(data=minio_obj, url_object=url)
        except Exception as e:
            logger.error(f"Error getting blob: {e}")
            raise
    
    def blob_exists(self, url_string: str) -> bool:
        """Checks if a blob exists."""
        url = BlobStoreURL(url=url_string)
        
        try:
            self.client.stat_object(url.bucket, url.path)
            return True
        except Exception:
            return False
    
    def url_is_file(self, url: Union[StorageURL, str]) -> bool:
        """Checks if a URL points to a file."""
        if isinstance(url, str):
            url = BlobStoreURL(url=url)
        
        return self.blob_exists(f"minio://{url.bucket}/{url.path}")
    

    # amapy_plugin_minio/minio_http_handler.py
    def list_blobs(self, url: Union[str, StorageURL], ignore: str = None) -> [StorageData]:
        """Lists blobs at the given URL."""
        if isinstance(url, str):
            url = BlobStoreURL(url=url, ignore=ignore)
    
        try:
            objects = self.client.list_objects(
                url.bucket,
                prefix=url.path or None,
                recursive=True
            )
            
            result = []
            for obj in objects:
                result.append(MinioBlob(data=obj, url_object=url))
        
            return result
        except Exception as e:
            logger.error(f"Error listing blobs: {e}")
            return []
    
    def delete_blobs(self, url_strings: [str]) -> None:
        """Deletes blobs at the given URLs."""
        for url_string in url_strings:
            url = BlobStoreURL(url=url_string)
            
            try:
                self.client.remove_object(url.bucket, url.path)
            except Exception as e:
                logger.error(f"Error deleting blob: {e}")
    

    def filter_duplicate_blobs(self, src_blobs: [StorageData], dst_blobs: [StorageData]) -> (list, list):
        """Filters the source blobs to determine which blobs are new and which need to be replaced in the destination.

        If a blob in `src_blobs` has the same path_in_asset as a blob in `dst_blobs`, it compares their hashes.
        If the hashes are different, the blob is added to the replace_blobs list. If the path_in_asset is not
        found in `dst_blobs`, the blob is considered new and is added to the new_blobs list. For upload and download
        operations, the multipart sizes of the blobs are updated before hash comparison.

        Parameters
        ----------
        src_blobs : list
            A list of source blobs.
        dst_blobs : list
            A list of destination blobs.

        Returns
        -------
        tuple
            A tuple containing two lists: new_blobs and replace_blobs. new_blobs is a list of blobs that are new and
            replace_blobs is a list of blobs that need to be replaced in the destination.
        """
        # TODO: improve the overall implementation
        if not dst_blobs:  # nothing to filter against
            return src_blobs, []
        if all(isinstance(blob, MinioBlob) for blob in src_blobs) and all(
                isinstance(blob, Minio) for blob in dst_blobs):  # asset cp remote copy
            new_blobs, replace_blobs = [], []
            # compare the path_in_asset and hash of the blobs
            dst_blob_map = {obj.path_in_asset: obj for obj in dst_blobs}
            for src_blob in src_blobs:
                if src_blob.path_in_asset in dst_blob_map:
                    # no need to update the multipart sizes before hash comparison
                    if not src_blob.compare_hash(dst_blob_map[src_blob.path_in_asset]):
                        replace_blobs.append(src_blob)
                else:
                    # new path_in_asset new object
                    new_blobs.append(src_blob)
            return new_blobs, replace_blobs

        # src_blobs or dst_blobs must be PosixBlob objects
        new_blobs, replace_blobs = [], []
        # compare the path_in_asset and hash of the blobs
        dst_blob_map = {obj.path_in_asset: obj for obj in dst_blobs}
        need_hash_compare = []
        for src_blob in src_blobs:
            if src_blob.path_in_asset in dst_blob_map:
                # need to compare hash
                need_hash_compare.append(src_blob)
            else:
                # new path_in_asset new object
                new_blobs.append(src_blob)

        if all(isinstance(blob, MinioBlob) for blob in need_hash_compare):  # asset cp download
            # update the multipart sizes of the blobs that need hash comparison
            self.get_transporter().update_multipart_blobs(blobs=need_hash_compare)
            for src_blob in need_hash_compare:
                posix_blob = dst_blob_map[src_blob.path_in_asset]
                if not posix_blob.compare_hash(src_blob):
                    replace_blobs.append(src_blob)
        else:  # asset cp upload
            # dst_blobs must be MinioBlob objects, update the multipart sizes
            self.get_transporter().update_multipart_blobs(
                blobs=[dst_blob_map[obj.path_in_asset] for obj in need_hash_compare])
            for posix_blob in need_hash_compare:
                dst_blob = dst_blob_map[posix_blob.path_in_asset]
                if not posix_blob.compare_hash(dst_blob):
                    replace_blobs.append(posix_blob)

        return new_blobs, replace_blobs

