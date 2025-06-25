import unittest
from unittest.mock import patch, Mock, MagicMock
from functools import cached_property
from typing import Union

from amapy_pluggy.storage import StorageData, StorageURL
from amapy_plugin_minio.minio_http_handler import MinioHttpHandler
from amapy_plugin_minio.minio_storage_mixin import MinioStorageMixin


class TestMinioStorageMixin(unittest.TestCase):
    
    def setUp(self):
        class ConcreteMinioStorage(MinioStorageMixin):
            @property
            def credentials(self):
                return {
                    'endpoint': 'minio.example.com',
                    'access_key': 'test_access_key',
                    'secret_key': 'test_secret_key',
                    'secure': True
                }
        
        self.mixin = ConcreteMinioStorage()
    
        
    def test_get_transporter(self):
        mock_handler = MagicMock()
        self.mixin.minio_handler = mock_handler
        
        self.mixin.get_transporter()
        mock_handler.get_transporter.assert_called_once()
    
    def test_allows_object_add(self):
        mock_handler = MagicMock()
        mock_handler.allows_object_add.return_value = True
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.allows_object_add()
        mock_handler.allows_object_add.assert_called_once()
        self.assertTrue(result)
    
    def test_allows_proxy(self):
        mock_handler = MagicMock()
        mock_handler.allows_proxy.return_value = True
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.allows_proxy()
        mock_handler.allows_proxy.assert_called_once()
        self.assertTrue(result)
    
    def test_get_storage_url(self):
        url_string = "minio://test-bucket/test-path"
        ignore = "minio://"
        
        mock_handler = MagicMock()
        mock_url = MagicMock()
        mock_handler.get_storage_url.return_value = mock_url
        self.mixin.minio_handler = mock_handler
        
        # Test without ignore parameter
        result = self.mixin.get_storage_url(url_string)
        mock_handler.get_storage_url.assert_called_with(url_string=url_string, ignore=None)
        self.assertEqual(result, mock_url)
        
        # Test with ignore parameter
        result = self.mixin.get_storage_url(url_string, ignore)
        mock_handler.get_storage_url.assert_called_with(url_string=url_string, ignore=ignore)
        self.assertEqual(result, mock_url)
    
    def test_get_blob(self):
        url_string = "minio://test-bucket/test-path"
        
        mock_handler = MagicMock()
        mock_blob = MagicMock(spec=StorageData)
        mock_handler.get_blob.return_value = mock_blob
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.get_blob(url_string)
        mock_handler.get_blob.assert_called_once_with(url_string=url_string)
        self.assertEqual(result, mock_blob)
    
    def test_blob_exists(self):
        url_string = "minio://test-bucket/test-path"
        
        mock_handler = MagicMock()
        mock_handler.blob_exists.return_value = True
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.blob_exists(url_string)
        mock_handler.blob_exists.assert_called_once_with(url_string=url_string)
        self.assertTrue(result)
    
    def test_url_is_file_with_string(self):
        url_string = "minio://test-bucket/test-path"
        
        mock_handler = MagicMock()
        mock_handler.url_is_file.return_value = True
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.url_is_file(url_string)
        mock_handler.url_is_file.assert_called_once_with(url=url_string)
        self.assertTrue(result)
    
    def test_url_is_file_with_url_object(self):
        url_obj = MagicMock(spec=StorageURL)
        
        mock_handler = MagicMock()
        mock_handler.url_is_file.return_value = False
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.url_is_file(url_obj)
        mock_handler.url_is_file.assert_called_once_with(url=url_obj)
        self.assertFalse(result)
    
    def test_list_blobs_with_string(self):
        url_string = "minio://test-bucket/test-path"
        
        mock_handler = MagicMock()
        mock_blobs = [MagicMock(spec=StorageData), MagicMock(spec=StorageData)]
        mock_handler.list_blobs.return_value = mock_blobs
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.list_blobs(url_string)
        mock_handler.list_blobs.assert_called_once_with(url=url_string, ignore=None)
        self.assertEqual(result, mock_blobs)
    
    def test_list_blobs_with_url_and_ignore(self):
        url_obj = MagicMock(spec=StorageURL)
        ignore = "minio://"
        
        mock_handler = MagicMock()
        mock_blobs = [MagicMock(spec=StorageData)]
        mock_handler.list_blobs.return_value = mock_blobs
        self.mixin.minio_handler = mock_handler
        
        result = self.mixin.list_blobs(url_obj, ignore)
        mock_handler.list_blobs.assert_called_once_with(url=url_obj, ignore=ignore)
        self.assertEqual(result, mock_blobs)
    
    def test_delete_blobs(self):
        url_strings = ["minio://test-bucket/test-path1", "minio://test-bucket/test-path2"]
        
        mock_handler = MagicMock()
        self.mixin.minio_handler = mock_handler
        
        self.mixin.delete_blobs(url_strings)
        mock_handler.delete_blobs.assert_called_once_with(url_strings=url_strings)


if __name__ == '__main__':
    unittest.main()