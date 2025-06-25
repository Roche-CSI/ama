import json
import pytest
from minio import Minio
from unittest.mock import patch, MagicMock
from amapy_plugin_minio.bucket_cors import get_minio_client, get_bucket_cors, set_bucket_cors


def test_get_minio_client():
    credentials = {
        'endpoint': 'test-endpoint:9000',
        'access_key': 'test-access',
        'secret_key': 'test-secret',
        'secure': True
    }

    client = get_minio_client(credentials)
    assert isinstance(client, Minio)


def test_get_bucket_cors(mock_client):
    with patch('amapy_plugin_minio.bucket_cors.get_minio_client', return_value=mock_client.minio_client):
        mock_client.minio_client.get_bucket_policy = MagicMock(return_value='{"Version":"2012-10-17","Statement":[]}')
        
        result = get_bucket_cors(mock_client.credentials, 'test-bucket')
        
        assert result == '{"Version":"2012-10-17","Statement":[]}'
        mock_client.minio_client.get_bucket_policy.assert_called_once_with('test-bucket')

def test_set_bucket_cors( mock_client):
    with patch('amapy_plugin_minio.bucket_cors.get_minio_client', return_value=mock_client.minio_client):
        mock_client.minio_client.bucket_exists = MagicMock(return_value=False)
        mock_client.minio_client.make_bucket = MagicMock()
        mock_client.minio_client.set_bucket_policy = MagicMock()
        
        result = set_bucket_cors(mock_client.credentials, 'test-bucket', 'http://example.com')
        
        assert result is True
        mock_client.minio_client.bucket_exists.assert_called_once_with('test-bucket')
        mock_client.minio_client.make_bucket.assert_called_once_with('test-bucket')
        mock_client.minio_client.set_bucket_policy.assert_called_once()
