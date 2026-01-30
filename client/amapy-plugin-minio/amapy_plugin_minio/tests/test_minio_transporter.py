import unittest
import os
import tempfile
from unittest.mock import patch, MagicMock, mock_open

from minio import Minio
from minio.error import S3Error

from amapy_pluggy.storage import BlobStoreURL
from amapy_plugin_minio.minio_transporter import MinioTransporter
from amapy_plugin_minio.transporter.minio_transport_resources import (
    MinioDownloadResource,
    MinioUploadResource,
    MinioCopyResource
)

class TestMinioTransporter(unittest.TestCase):
    """Test suite for MinioTransporter download, upload, and copy operations."""

    def setUp(self):
        """Set up test environment."""
        self.credentials = {
            'endpoint': 'minio.example.com',
            'access_key': 'test_access_key',
            'secret_key': 'test_secret_key',
            'secure': True
        }
        self.prefixes = ["minio://"]
        
        # Create temporary directory and test files
        self.temp_dir = tempfile.mkdtemp()
        self.test_file_path = os.path.join(self.temp_dir, 'test_file.txt')
        with open(self.test_file_path, 'w') as f:
            f.write('Test content for MinIO operations')
        
        # Create test URLs
        self.src_url = "minio://test-bucket/test-dir/source-file.txt"
        self.dst_url = "minio://test-bucket/test-dir/dest-file.txt"
        
        # Create a mock client
        self.mock_client = MagicMock(spec=Minio)
        
        # Create the transporter with the mock client
        with patch('minio.Minio', return_value=self.mock_client):
            self.transporter = MinioTransporter.shared(
                credentials=self.credentials,
                prefixes=self.prefixes
            )
            # Ensure the client is our mock
            self.transporter.client = self.mock_client

    def tearDown(self):
        """Clean up after tests."""
        # Remove test files
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
        if os.path.exists(self.temp_dir):
            os.rmdir(self.temp_dir)

    @patch('os.makedirs')
    @patch('builtins.open', new_callable=mock_open)
    def test_download(self, mock_file, mock_makedirs):
        """Test download method."""
        # Set up mock response
        mock_response = MagicMock()
        mock_data = b"file content"
        mock_response.read.return_value = mock_data
        mock_response.close = MagicMock()
        mock_response.release_conn = MagicMock()
        self.mock_client.get_object.return_value = mock_response
        
        # Create test resource
        resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.test_file_path,
            hash=("etag", "abc123")
        )
        resource.on_transfer_complete = MagicMock()
        
        # Mock BlobStoreURL
        with patch('amapy_plugin_minio.minio_transporter.BlobStoreURL') as mock_url:
            mock_url_instance = MagicMock()
            mock_url_instance.bucket = "test-bucket"
            mock_url_instance.path = "test-dir/source-file.txt"
            mock_url_instance.is_valid.return_value = True
            mock_url.return_value = mock_url_instance
            
            self.transporter.download([resource])
            
            mock_makedirs.assert_called_once_with(os.path.dirname(self.test_file_path), exist_ok=True)
            
            self.mock_client.get_object.assert_called_once_with("test-bucket", "test-dir/source-file.txt")
            
            mock_file.assert_called_once_with(self.test_file_path, 'wb')
            mock_file().write.assert_called_once_with(mock_data)
            
            mock_response.close.assert_called_once()
            mock_response.release_conn.assert_called_once()
            
            resource.on_transfer_complete.assert_called_once_with(mock_data)

    def test_upload(self):
        """Test upload method."""
        # Set up mock client
        self.mock_client.bucket_exists.return_value = True
        mock_result = MagicMock()
        self.mock_client.fput_object.return_value = mock_result
        
        # Create test resource
        resource = MinioUploadResource(
            src=self.test_file_path,
            dst=self.dst_url,
            hash=("md5", "abc123")
        )
        resource.on_transfer_complete = MagicMock()
        
        # Mock BlobStoreURL
        with patch('amapy_plugin_minio.minio_transporter.BlobStoreURL') as mock_url:
            mock_url_instance = MagicMock()
            mock_url_instance.bucket = "test-bucket"
            mock_url_instance.path = "test-dir/dest-file.txt"
            mock_url_instance.is_valid.return_value = True
            mock_url.return_value = mock_url_instance
            
            self.transporter.upload([resource])
            
            self.mock_client.bucket_exists.assert_called_once_with("test-bucket")
            
            self.mock_client.fput_object.assert_called_once_with(
                "test-bucket", 
                "test-dir/dest-file.txt", 
                self.test_file_path,
                content_type='text/plain'
            )
            resource.on_transfer_complete.assert_called_once_with(mock_result)

    def test_copy(self):
        """Test copy method."""
        # Set up mock client
        self.mock_client.bucket_exists.return_value = True
        mock_result = MagicMock()
        self.mock_client.copy_object.return_value = mock_result
        
        # Create test resource
        resource = MinioCopyResource(
            src="minio://source-bucket/source-path/file.txt",
            dst="minio://dest-bucket/dest-path/file.txt",
            hash=("etag", "abc123"),
            size=1024
        )
        resource.on_transfer_complete = MagicMock()
        
        # Mock BlobStoreURL for source and destination
        with patch('amapy_plugin_minio.minio_transporter.BlobStoreURL') as mock_url:
            # Create mock URL instances for source and destination
            src_url = MagicMock()
            src_url.bucket = "source-bucket"
            src_url.path = "source-path/file.txt"
            src_url.is_valid.return_value = True
            
            dst_url = MagicMock()
            dst_url.bucket = "dest-bucket"
            dst_url.path = "dest-path/file.txt"
            dst_url.is_valid.return_value = True
            
            # Configure mock_url to return different instances for each call
            mock_url.side_effect = [src_url, dst_url]
            
            self.transporter.copy([resource])
            self.mock_client.bucket_exists.assert_called_once_with("dest-bucket")
            self.mock_client.copy_object.assert_called_once_with(
                "dest-bucket",
                "dest-path/file.txt",
                "source-bucket/source-path/file.txt"
            )
            resource.on_transfer_complete.assert_called_once_with(mock_result)


if __name__ == '__main__':
    unittest.main()