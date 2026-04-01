import datetime
from unittest.mock import patch, MagicMock
from urllib.parse import urlparse, parse_qs, unquote

from amapy_plugin_gcs.signed_url import generate_signed_url

BUCKET_NAME = "my-test-bucket"
OBJECT_NAME = "path/to/object.txt"


def test_generate_signed_url():
    mock_creds = MagicMock()
    mock_creds.service_account_email = "test@test-project.iam.gserviceaccount.com"
    mock_creds.signer.sign.return_value = b"fakesignature"

    fixed_now = datetime.datetime(2026, 1, 15, 12, 0, 0, tzinfo=datetime.UTC)

    with patch("amapy_plugin_gcs.signed_url.service_account.Credentials") as mock_sa, \
         patch("amapy_plugin_gcs.signed_url.datetime") as mock_dt:
        mock_sa.from_service_account_info.return_value = mock_creds
        mock_dt.datetime.now.return_value = fixed_now
        mock_dt.UTC = datetime.UTC

        url = generate_signed_url(
            bucket_name=BUCKET_NAME,
            object_name=OBJECT_NAME,
            service_account_json={"key": "value"},
        )

    # parse the signed URL
    parsed = urlparse(url)
    params = {k: v[0] for k, v in parse_qs(parsed.query).items()}

    # structure
    assert url.startswith("https://")
    assert parsed.hostname == f"{BUCKET_NAME}.storage.googleapis.com"
    assert parsed.path == f"/{OBJECT_NAME}"

    # required GCS V4 query parameters
    assert params["X-Goog-Algorithm"] == "GOOG4-RSA-SHA256"
    assert params["X-Goog-Date"] == "20260115T120000Z"
    assert params["X-Goog-Expires"] == "604800"
    assert "host" in params["X-Goog-SignedHeaders"]
    expected_credential = "test@test-project.iam.gserviceaccount.com/20260115/auto/storage/goog4_request"
    assert unquote(params["X-Goog-Credential"]) == expected_credential

    # signature is hex-encoded
    signature = params["x-goog-signature"]
    assert signature == b"fakesignature".hex()
