from unittest.mock import patch, MagicMock

from amapy_plugin_gcs.bucket_cors import update_cors_configuration


def test_update_cors_configuration(mock_gcs_credentials):
    mock_bucket = MagicMock()
    mock_bucket.name = "my_test_bucket"
    mock_bucket.cors = [{"origin": [], "method": ["GET"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]

    mock_client = MagicMock()
    mock_client.get_bucket.return_value = mock_bucket

    bucket_name = "my_test_bucket"
    origin_url = "http://localhost:3000"

    with patch("amapy_plugin_gcs.bucket_cors.storage.Client.from_service_account_info", return_value=mock_client):
        bucket = update_cors_configuration(mock_gcs_credentials, bucket_name, origin_url)
        assert origin_url in bucket.cors[0]["origin"]
        print(f"bucket :{bucket}")
