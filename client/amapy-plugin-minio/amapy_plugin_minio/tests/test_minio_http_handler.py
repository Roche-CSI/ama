import unittest
from unittest.mock import patch, Mock, MagicMock
import pytest
from datetime import datetime
from functools import cached_property
from minio import Minio

from amapy_pluggy.storage import StorageData, StorageURL, BlobStoreURL
from amapy_plugin_minio.minio_transporter import MinioTransporter
from amapy_plugin_minio.minio_blob import MinioBlob
from amapy_plugin_minio.minio_http_handler import MinioHttpHandler


class TestMinioHttpHandler(unittest.TestCase):
    
    def setUp(self):
        self.test_credentials = {
            'endpoint': 'minio.example.com',
            'access_key': 'test_access_key',
            'secret_key': 'test_secret_key',
            'secure': True
        }
        self.handler = MinioHttpHandler(credentials=self.test_credentials)
    
    def test_init(self):
        handler = MinioHttpHandler(credentials=self.test_credentials)
        self.assertEqual(handler.cred, self.test_credentials)
        
        # Test with no credentials
        handler = MinioHttpHandler()
        self.assertIsNone(handler.cred)
    
    def test_credentials(self):
        # Test with credentials provided
        self.assertEqual(self.handler.credentials, self.test_credentials)
        
        # Test with no credentials
        handler = MinioHttpHandler()
        self.assertEqual(handler.credentials, {})
    
    @patch('minio.Minio')
    def test_client(self, mock_minio):
        
        # Test with false string secure value
        handler = MinioHttpHandler(credentials={
            'endpoint': 'minio.example.com',
            'access_key': 'test_access_key',
            'secret_key': 'test_secret_key',
            'secure': 'False'
        })
        assert isinstance(handler, MinioHttpHandler)
        assert isinstance(handler.client, Minio)
    
    def test_allows_object_add(self):
        self.assertTrue(self.handler.allows_object_add())
    
    def test_allows_proxy(self):
        self.assertTrue(self.handler.allows_proxy())
    
    @patch('amapy_plugin_minio.minio_transporter.MinioTransporter.shared')
    def test_get_transporter(self, mock_shared):
        transporter = self.handler.get_transporter()
        mock_shared.assert_called_once_with(
            credentials=self.test_credentials,
            prefixes=["minio://"]
        )
    
    def test_get_storage_url(self):
        url_string = "minio://test-bucket/test-path"
        url = self.handler.get_storage_url(url_string)
        self.assertIsInstance(url, BlobStoreURL)
        self.assertEqual(url.url, url_string)
        
        # Test with ignore parameter
        ignore = "minio://"
        url = self.handler.get_storage_url(url_string, ignore=ignore)
        self.assertIsInstance(url, BlobStoreURL)
        self.assertEqual(url.url, url_string)
        self.assertEqual(url.ignore, ignore)
    
    @patch('amapy_plugin_minio.minio_http_handler.BlobStoreURL')
    def test_get_blob(self, mock_url):
        url_string = "minio://test-bucket/test-path"
        mock_url_instance = MagicMock()
        mock_url_instance.bucket = "test-bucket"
        mock_url_instance.path = "test-path"
        mock_url.return_value = mock_url_instance
        
        stat_mock = MagicMock()
        stat_mock.size = 100
        stat_mock.last_modified = datetime.now()
        stat_mock.etag = "test-etag"
        
        self.handler.client = MagicMock()
        self.handler.client.stat_object.return_value = stat_mock
        
        blob = self.handler.get_blob(url_string)
        
        mock_url.assert_called_once_with(url=url_string)
        self.handler.client.stat_object.assert_called_once_with("test-bucket", "test-path")
        self.assertIsInstance(blob, MinioBlob)
        
        # Test exception handling
        self.handler.client.stat_object.side_effect = Exception("Test error")
        with self.assertRaises(Exception):
            self.handler.get_blob(url_string)
    
    @patch('amapy_plugin_minio.minio_http_handler.BlobStoreURL')
    def test_blob_exists(self, mock_url):
        url_string = "minio://test-bucket/test-path"
        mock_url_instance = MagicMock()
        mock_url_instance.bucket = "test-bucket"
        mock_url_instance.path = "test-path"
        mock_url.return_value = mock_url_instance
        
        self.handler.client = MagicMock()
        
        # Test when blob exists
        self.handler.client.stat_object.return_value = MagicMock()
        self.assertTrue(self.handler.blob_exists(url_string))
        self.handler.client.stat_object.assert_called_once_with("test-bucket", "test-path")
        
        # Test when blob does not exist
        self.handler.client.stat_object.side_effect = Exception("Object does not exist")
        self.assertFalse(self.handler.blob_exists(url_string))
    
    @patch('amapy_plugin_minio.minio_http_handler.BlobStoreURL')
    def test_url_is_file(self, mock_url):
        # Test with string URL
        url_string = "minio://test-bucket/test-path"
        mock_url_instance = MagicMock()
        mock_url_instance.bucket = "test-bucket"
        mock_url_instance.path = "test-path"
        mock_url.return_value = mock_url_instance
        
        with patch.object(self.handler, 'blob_exists', return_value=True) as mock_blob_exists:
            self.assertTrue(self.handler.url_is_file(url_string))
            mock_blob_exists.assert_called_once_with("minio://test-bucket/test-path")
        
        # Test with StorageURL
        url_obj = MagicMock(spec=StorageURL)
        url_obj.bucket = "test-bucket"
        url_obj.path = "test-path"
        
        with patch.object(self.handler, 'blob_exists', return_value=False) as mock_blob_exists:
            self.assertFalse(self.handler.url_is_file(url_obj))
            mock_blob_exists.assert_called_once_with("minio://test-bucket/test-path")
    
    @patch('amapy_plugin_minio.minio_http_handler.BlobStoreURL')
    def test_list_blobs(self, mock_url):
        # Test with string URL
        url_string = "minio://test-bucket/test-path"
        mock_url_instance = MagicMock()
        mock_url_instance.bucket = "test-bucket"
        mock_url_instance.path = "test-path"
        mock_url.return_value = mock_url_instance
        
        mock_objects = [MagicMock(), MagicMock()]
        self.handler.client = MagicMock()
        self.handler.client.list_objects.return_value = mock_objects
        
        blobs = self.handler.list_blobs(url_string)
        
        mock_url.assert_called_once_with(url=url_string, ignore=None)
        self.handler.client.list_objects.assert_called_once_with(
            "test-bucket",
            prefix="test-path",
            recursive=True
        )
        self.assertEqual(len(blobs), 2)
        for blob in blobs:
            self.assertIsInstance(blob, MinioBlob)
        
        # Test with StorageURL
        url_obj = MagicMock(spec=StorageURL)
        url_obj.bucket = "test-bucket"
        url_obj.path = ""
        mock_url.return_value = url_obj
        
        blobs = self.handler.list_blobs(url_obj)
        
        self.handler.client.list_objects.assert_called_with(
            "test-bucket",
            prefix=None,
            recursive=True
        )
        
        # Test exception handling
        self.handler.client.list_objects.side_effect = Exception("Test error")
        blobs = self.handler.list_blobs(url_string)
        self.assertEqual(blobs, [])
    
    @patch('amapy_plugin_minio.minio_http_handler.BlobStoreURL')
    def test_delete_blobs(self, mock_url):
        url_strings = ["minio://test-bucket/test-path1", "minio://test-bucket/test-path2"]
        
        mock_url_instances = []
        for i, url_string in enumerate(url_strings):
            mock_url_instance = MagicMock()
            mock_url_instance.bucket = "test-bucket"
            mock_url_instance.path = f"test-path{i+1}"
            mock_url_instances.append(mock_url_instance)
        
        mock_url.side_effect = mock_url_instances
        
        self.handler.client = MagicMock()
        
        self.handler.delete_blobs(url_strings)
        
        self.assertEqual(mock_url.call_count, 2)
        self.handler.client.remove_object.assert_any_call("test-bucket", "test-path1")
        self.handler.client.remove_object.assert_any_call("test-bucket", "test-path2")
        
    
    def test_filter_duplicate_blobs_empty_dst(self):
        src_blobs = [MagicMock(spec=MinioBlob) for _ in range(3)]
        dst_blobs = []
        
        new_blobs, replace_blobs = self.handler.filter_duplicate_blobs(src_blobs, dst_blobs)
        
        self.assertEqual(new_blobs, src_blobs)
        self.assertEqual(replace_blobs, [])
    
    def test_filter_duplicate_blobs_minio_to_minio(self):
        # Setup source blobs
        src_blobs = []
        for i in range(3):
            blob = MagicMock(spec=MinioBlob)
            blob.path_in_asset = f"path{i}"
            src_blobs.append(blob)
        
        # Setup destination blobs - one matching, one with different hash
        dst_blobs = []
        for i in range(2):
            blob = MagicMock(spec=Minio)
            blob.path_in_asset = f"path{i}"
            dst_blobs.append(blob)
        
        # Configure hash comparison results
        src_blobs[0].compare_hash.return_value = True  # Same hash
        src_blobs[1].compare_hash.return_value = False  # Different hash
        
        new_blobs, replace_blobs = self.handler.filter_duplicate_blobs(src_blobs, dst_blobs)
        
        # path0 has same hash, path1 has different hash and needs replacement, path2 is new
        self.assertEqual(new_blobs, [src_blobs[2]])
        self.assertEqual(replace_blobs, [src_blobs[1]])
    
    @patch('amapy_plugin_minio.minio_http_handler.MinioHttpHandler.get_transporter')
    def test_filter_duplicate_blobs_download(self, mock_get_transporter):
        # Setup source blobs (MinioBlob for download)
        src_blobs = []
        for i in range(2):
            blob = MagicMock(spec=MinioBlob)
            blob.path_in_asset = f"path{i}"
            src_blobs.append(blob)
        
        # Setup destination blobs (not MinioBlob)
        dst_blobs = []
        for i in range(2):
            blob = MagicMock()  # Not MinioBlob - representing PosixBlob
            blob.path_in_asset = f"path{i}"
            dst_blobs.append(blob)
        
        # Mock transporter
        mock_transporter = MagicMock()
        mock_get_transporter.return_value = mock_transporter
        
        # Configure hash comparison results
        dst_blobs[0].compare_hash.return_value = True  # Same hash
        dst_blobs[1].compare_hash.return_value = False  # Different hash
        
        new_blobs, replace_blobs = self.handler.filter_duplicate_blobs(src_blobs, dst_blobs)
        
        # Verify update_multipart_blobs was called
        mock_transporter.update_multipart_blobs.assert_called_once_with(blobs=src_blobs)
        
        # path0 has same hash, path1 has different hash and needs replacement
        self.assertEqual(new_blobs, [])
        self.assertEqual(replace_blobs, [src_blobs[1]])
    
    @patch('amapy_plugin_minio.minio_http_handler.MinioHttpHandler.get_transporter')
    def test_filter_duplicate_blobs_upload(self, mock_get_transporter):
        # Setup source blobs (not MinioBlob for upload)
        src_blobs = []
        for i in range(2):
            blob = MagicMock()  # Not MinioBlob - representing PosixBlob
            blob.path_in_asset = f"path{i}"
            src_blobs.append(blob)
        
        # Setup destination blobs (MinioBlob)
        dst_blobs = []
        for i in range(2):
            blob = MagicMock(spec=MinioBlob)
            blob.path_in_asset = f"path{i}"
            dst_blobs.append(blob)
        
        # Mock transporter
        mock_transporter = MagicMock()
        mock_get_transporter.return_value = mock_transporter
        
        # Configure hash comparison results
        src_blobs[0].compare_hash.return_value = True  # Same hash
        src_blobs[1].compare_hash.return_value = False  # Different hash
        
        new_blobs, replace_blobs = self.handler.filter_duplicate_blobs(src_blobs, dst_blobs)
        
        # Verify update_multipart_blobs was called with dst_blobs
        mock_transporter.update_multipart_blobs.assert_called_once_with(blobs=dst_blobs)
        
        # path0 has same hash, path1 has different hash and needs replacement
        self.assertEqual(new_blobs, [])
        self.assertEqual(replace_blobs, [src_blobs[1]])


if __name__ == '__main__':
    unittest.main()