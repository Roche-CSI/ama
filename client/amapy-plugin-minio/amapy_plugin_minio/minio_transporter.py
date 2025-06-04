import os
import logging
from minio import Minio
from amapy_pluggy.storage.transporter import Transporter
from amapy_pluggy.storage import TransportResource
from amapy_pluggy.storage import BlobStoreURL

logger = logging.getLogger(__name__)

class MinioTransporter(Transporter):
    """Transporter implementation for MinIO operations."""
    
    def post_init(self, **kwargs):
        super().post_init(**kwargs)
        
        # Initialize MinIO client
        endpoint = self.credentials.get('endpoint', 'localhost:9000')
        access_key = self.credentials.get('access_key', 'minioadmin')
        secret_key = self.credentials.get('secret_key', 'minioadmin')
        secure = self.credentials.get('secure', False)
        
        if isinstance(secure, str):
            secure = secure.lower() == 'true'
        
        self.client = Minio(
            endpoint,
            access_key=access_key,
            secret_key=secret_key,
            secure=secure
        )
    
    def get_download_resource(self, src: str, dst: str, src_hash: tuple) -> TransportResource:
        """Create a download resource for MinIO."""
        # Use MinioDownloadResource if available, otherwise use TransportResource
        try:
            from amapy_plugin_minio.transport.minio_transport_resources import MinioDownloadResource
            return MinioDownloadResource(
                src=src,
                dst=dst,
                hash=src_hash
            )
        except ImportError:
            return TransportResource(
                src=src,
                dst=dst,
                hash=src_hash
            )
    
    def get_upload_resource(self, src: str, dst: str, src_hash: tuple) -> TransportResource:
        """Create an upload resource for MinIO."""
        try:
            from amapy_plugin_minio.transport.minio_transport_resources import MinioUploadResource
            return MinioUploadResource(
                src=src,
                dst=dst,
                hash=src_hash
            )
        except ImportError:
            return TransportResource(
                src=src,
                dst=dst,
                hash=src_hash
            )
    
    def get_copy_resource(self, src: str, dst: str, src_hash: tuple, **kwargs) -> TransportResource:
        """Create a copy resource for MinIO."""
        try:
            from amapy_plugin_minio.transport.minio_transport_resources import MinioCopyResource
            return MinioCopyResource(
                src=src,
                dst=dst,
                hash=src_hash,
                **kwargs
            )
        except ImportError:
            return TransportResource(
                src=src,
                dst=dst,
                hash=src_hash,
                **kwargs
            )
    
        # amapy_plugin_minio/minio_transporter.py
    def download(self, resources: [TransportResource]):
        """Download resources from MinIO to local paths."""
        for resource in resources:
            try:
                # Parse the source URL
                url = BlobStoreURL(url=resource.src)
                
                if not url.is_valid():
                    raise ValueError(f"Invalid MinIO URL: {resource.src}")
                
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(resource.dst), exist_ok=True)
                
                # Download the file
                response = self.client.get_object(url.bucket, url.path)
                data = response.read()
                response.close()
                response.release_conn()
                
                # Write to file
                with open(resource.dst, 'wb') as f:
                    f.write(data)
                
                # Call the callback directly
                if resource.callback:
                    resource.callback(1)
                else:
                    # For MinioDownloadResource, use on_transfer_complete
                    if isinstance(resource, MinioDownloadResource):
                        resource.on_transfer_complete(data)
                
                logger.info(f"Successfully downloaded {resource.src} to {resource.dst}")
            except Exception as e:
                logger.error(f"Error downloading {resource.src} to {resource.dst}: {str(e)}")
                raise

    
    def upload(self, resources: [TransportResource]):
        """Upload resources from local paths to MinIO."""
        for resource in resources:
            try:
                # Parse the destination URL
                url = BlobStoreURL(url=resource.dst)
                
                if not url.is_valid():
                    raise ValueError(f"Invalid MinIO URL: {resource.dst}")
                
                # Ensure bucket exists
                if not self.client.bucket_exists(url.bucket):
                    self.client.make_bucket(url.bucket)
                    logger.info(f"Created bucket: {url.bucket}")
            
                # Get content type based on file extension
                content_type = None
                file_ext = os.path.splitext(resource.src)[1].lower()
                if file_ext:
                    content_type = {
                        '.json': 'application/json',
                        '.yaml': 'application/yaml',
                        '.yml': 'application/yaml',
                        '.txt': 'text/plain',
                        '.md': 'text/markdown',
                        '.html': 'text/html',
                        '.htm': 'text/html',
                        '.css': 'text/css',
                        '.js': 'application/javascript'
                    }.get(file_ext)
            
                # Upload the file
                result = self.client.fput_object(
                    url.bucket,
                    url.path,
                    resource.src,
                    content_type=content_type
                )
            
                # Call on_transfer_complete with the result
                resource.on_transfer_complete(result)
                
                logger.info(f"Successfully uploaded {resource.src} to {resource.dst}")
            except Exception as e:
                logger.error(f"Error uploading {resource.src} to {resource.dst}: {str(e)}")
                raise
    
    def copy(self, resources: [TransportResource]):
        """Copy resources within MinIO."""
        for resource in resources:
            try:
                # Parse the source and destination URLs
                src_url = BlobStoreURL(url=resource.src)
                dst_url = BlobStoreURL(url=resource.dst)
                
                if not src_url.is_valid() or not dst_url.is_valid():
                    raise ValueError(f"Invalid MinIO URL: {resource.src} or {resource.dst}")
                
                # Ensure destination bucket exists
                if not self.client.bucket_exists(dst_url.bucket):
                    self.client.make_bucket(dst_url.bucket)
                    logger.info(f"Created bucket: {dst_url.bucket}")
                
                # Copy the object
                result = self.client.copy_object(
                    dst_url.bucket,
                    dst_url.path,
                    f"{src_url.bucket}/{src_url.path}"
                )
                
                # Call on_transfer_complete with the result
                resource.on_transfer_complete(result)
                
                logger.info(f"Successfully copied {resource.src} to {resource.dst}")
            except Exception as e:
                logger.error(f"Error copying {resource.src} to {resource.dst}: {str(e)}")
                raise