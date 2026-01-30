import os
import hashlib
import tempfile
import unittest
from unittest.mock import patch, MagicMock, mock_open

import pytest
from amapy_pluggy.storage import BlobStoreURL
from amapy_pluggy.storage.transporter import TransportResource
from amapy_utils.common import exceptions
from amapy_plugin_minio.transporter.minio_transport_resources import (
    MinioTransportResource,
    MinioUploadResource,
    MinioDownloadResource,
    MinioCopyResource,
)
from amapy_plugin_minio.transporter.minio_hash import (
    normalize_etag,
    parse_multipart_etag,
    calculate_possible_etags,
    calculate_file_md5,
    verify_etag
)

class TestMinioTransportResources(unittest.TestCase):
    """Test suite for MinIO Transport Resources."""

    def setUp(self):
        """Set up test environment."""
        # Create a temporary directory for file operations
        self.temp_dir = tempfile.mkdtemp()
        self.test_file_path = os.path.join(self.temp_dir, 'test_file.txt')
        with open(self.test_file_path, 'w') as f:
            f.write('Test content for MinIO transport resources')

        # Create test URLs
        self.src_url = "minio://test-bucket/test-dir/source-file.txt"
        self.dst_url = "minio://test-bucket/test-dir/dest-file.txt"
        self.local_path = self.test_file_path

        # Create standard hash tuple
        self.md5_hash = ("md5", "test-md5-hash")
        self.etag_hash = ("etag", "testetaghash")
        self.multipart_etag_hash = ("etag", "test-etag-hash-2")

    def tearDown(self):
        """Clean up after tests."""
        # Remove test files
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
        if os.path.exists(self.temp_dir):
            os.rmdir(self.temp_dir)

    def test_minio_transport_resource_base_class(self):
        """Test the base MinioTransportResource class."""
        # Create a standard TransportResource
        std_resource = TransportResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.md5_hash
        )
        minio_resource = MinioTransportResource.from_transport_resource(std_resource)
        self.assertIsInstance(minio_resource, MinioTransportResource)
        self.assertEqual(minio_resource.src, self.src_url)
        self.assertEqual(minio_resource.dst, self.local_path)
        self.assertEqual(minio_resource.src_hash, self.md5_hash)

        # Test direct instantiation
        direct_resource = MinioTransportResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.md5_hash
        )
        self.assertEqual(direct_resource.src, self.src_url)
        self.assertEqual(direct_resource.dst, self.local_path)
        self.assertEqual(direct_resource.src_hash, self.md5_hash)

    def test_minio_upload_resource(self):
        """Test MinioUploadResource class."""
        upload_resource = MinioUploadResource(
            src=self.local_path,
            dst=self.dst_url,
            hash=self.md5_hash
        )

        # Verify basic attributes
        self.assertEqual(upload_resource.src, self.local_path)
        self.assertEqual(upload_resource.dst, self.dst_url)
        self.assertEqual(upload_resource.src_hash, self.md5_hash)

        # Test dst_url property
        with patch('amapy_plugin_minio.transporter.minio_transport_resources.BlobStoreURL') as mock_url:
            mock_url_instance = MagicMock()
            mock_url_instance.bucket = "test-bucket"
            mock_url_instance.path = "test-dir/dest-file.txt"
            mock_url.return_value = mock_url_instance

            # Access the cached_property
            dst_url = upload_resource.dst_url
            
            # Verify URL creation
            mock_url.assert_called_once_with(url=self.dst_url)
            self.assertEqual(dst_url, mock_url_instance)
            
            # Verify cached property works
            second_access = upload_resource.dst_url
            self.assertEqual(second_access, mock_url_instance)
            mock_url.assert_called_once()

    def test_minio_download_resource_init(self):
        """Test MinioDownloadResource initialization."""
        # Create a download resource (MinIO -> local)
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.etag_hash
        )

        # Verify basic attributes
        self.assertEqual(download_resource.src, self.src_url)
        self.assertEqual(download_resource.dst, self.local_path)
        self.assertEqual(download_resource.src_hash, self.etag_hash)
        self.assertIsNone(download_resource._dst_hash)

    def test_minio_download_resource_src_url(self):
        """Test src_url property of MinioDownloadResource."""
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.etag_hash
        )

        # Test src_url property
        with patch('amapy_plugin_minio.transporter.minio_transport_resources.BlobStoreURL') as mock_url:
            mock_url_instance = MagicMock()
            mock_url_instance.bucket = "test-bucket"
            mock_url_instance.path = "test-dir/source-file.txt"
            mock_url.return_value = mock_url_instance

            # Access the cached_property
            src_url = download_resource.src_url
            
            # Verify URL creation
            mock_url.assert_called_once_with(url=self.src_url)
            self.assertEqual(src_url, mock_url_instance)
            
            # Verify cached property works
            second_access = download_resource.src_url
            self.assertEqual(second_access, mock_url_instance)
            mock_url.assert_called_once() 
            
    @patch('os.path.exists')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.calculate_file_md5')
    def test_compute_dest_hash_non_etag(self, mock_calculate_md5, mock_exists):
        """Test compute_dest_hash method with non-etag hash type."""
        mock_exists.return_value = True
        
        # Create a download resource with MD5 hash
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.md5_hash
        )
        
        # Mock the parent class method
        with patch.object(TransportResource, 'compute_dest_hash') as mock_parent_method:
            mock_parent_method.return_value = ("md5", "computed-md5-hash")
            
            # Call method with non-etag hash type
            result = download_resource.compute_dest_hash("md5")
            
            # Verify parent method was called
            mock_parent_method.assert_called_once_with(hash_type="md5")
            self.assertEqual(result, ("md5", "computed-md5-hash"))
            
            # Verify MD5 calculation was not called
            mock_calculate_md5.assert_not_called()

    @patch('os.path.exists')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.calculate_file_md5')
    def test_compute_dest_hash_etag_single_part(self, mock_calculate_md5, mock_exists):
        """Test compute_dest_hash method with single-part etag."""
        mock_exists.return_value = True
        mock_calculate_md5.return_value = "calculated-md5-hash"
        
        # Create a download resource with etag hash
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.etag_hash
        )
        
        # Call method with etag hash type
        result = download_resource.compute_dest_hash("etag")
        
        # Verify MD5 calculation was called
        mock_calculate_md5.assert_called_once_with(self.local_path)
        self.assertEqual(result, ("etag", ["calculated-md5-hash"]))

    @patch('os.path.exists')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.normalize_etag')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.parse_multipart_etag')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.calculate_possible_etags')
    def test_compute_dest_hash_etag_multi_part(self, mock_calculate_possible_etags, mock_parse_etag, mock_normalize_etag, mock_exists):
        """Test compute_dest_hash method with multi-part etag."""
        mock_exists.return_value = True
        mock_normalize_etag.return_value = "multipart-etag-3"
        mock_parse_etag.return_value = ("base-hash", 3)  # 3 parts
        mock_calculate_possible_etags.return_value = ["possible-etag-1", "possible-etag-2"]
        
        # Create a download resource with multipart etag hash
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=("etag", "multipart-etag-3")
        )
        
        # Call method with etag hash type
        result = download_resource.compute_dest_hash("etag")
        
        # Verify calculations were called
        mock_normalize_etag.assert_called_once_with("multipart-etag-3")
        mock_parse_etag.assert_called_once_with("multipart-etag-3")
        mock_calculate_possible_etags.assert_called_once_with(self.local_path, 3)
        
        self.assertEqual(result, ("etag", ["possible-etag-1", "possible-etag-2"]))

    @patch('os.path.exists')
    def test_compute_dest_hash_etag_file_not_exists(self, mock_exists):
        """Test compute_dest_hash method when file doesn't exist."""
        mock_exists.return_value = False
        
        # Create a download resource
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=self.etag_hash
        )
        
        # Call method with etag hash type
        result = download_resource.compute_dest_hash("etag")
        
        # Verify empty result
        self.assertEqual(result, ("etag", []))

    @patch('os.path.exists')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.normalize_etag')
    @patch('amapy_plugin_minio.transporter.minio_transport_resources.parse_multipart_etag')
    def test_compute_dest_hash_etag_parse_error(self, mock_parse_etag, mock_normalize_etag, mock_exists):
        """Test compute_dest_hash method with etag parsing error."""
        mock_exists.return_value = True
        mock_normalize_etag.return_value = "multipart-etag-3"
        mock_parse_etag.side_effect = ValueError("Invalid etag format")
        
        # Create a download resource
        download_resource = MinioDownloadResource(
            src=self.src_url,
            dst=self.local_path,
            hash=("etag", "multipart-etag-3")
        )
        
        # Call method with etag hash type
        result = download_resource.compute_dest_hash("etag")
        
        # Verify empty result due to error
        self.assertEqual(result, ("etag", []))

