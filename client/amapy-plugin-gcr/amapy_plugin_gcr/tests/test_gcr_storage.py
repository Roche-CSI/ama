import json
from unittest.mock import patch

import pytest

from amapy_plugin_gcr.gcr_blob import GcrBlob
from amapy_plugin_gcr.gcr_storage import GcrStorage

TEST_URLS = [
    "gcr.io/my-test-project/my-test-image@sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "gcr.io/my-test-project/my-test-image:latest",
]

EXPECTED_BLOB = {
    "name": "my-test-project/my-test-image",
    "size": 2391153464,
    "content_type": "application/vnd.docker.distribution.manifest.v2+json",
    "hashes": {"sha256": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890"},
    "tag": ["latest"],
    "host": "gcr.io",
    "url": "gcr.io/my-test-project/my-test-image@sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
}


@pytest.fixture
def gcr_storage(fake_url_data):
    """Provides a GcrStorage instance with validation and fetch_url_data mocked."""
    with (
        patch.object(GcrStorage, attribute="validate"),
        patch("amapy_plugin_gcr.gcr_mixin.GcrMixin.fetch_url_data", return_value=fake_url_data),
    ):
        yield GcrStorage.shared()


def assert_blob(blob: GcrBlob, expected: dict):
    for key, value in expected.items():
        actual = getattr(blob, key)
        if isinstance(value, dict):
            assert json.dumps(value) == json.dumps(actual), f"Mismatch for {key}"
        else:
            assert value == actual, f"Mismatch for {key}"


def test_get_blob(gcr_storage):
    for url in TEST_URLS:
        blob = gcr_storage.get_blob(url=url)
        assert isinstance(blob, GcrBlob)
        assert_blob(blob, EXPECTED_BLOB)


def test_list_blobs(gcr_storage):
    for url in TEST_URLS:
        blobs = gcr_storage.list_blobs(url=url)
        assert len(blobs) == 1
        assert isinstance(blobs[0], GcrBlob)
        assert_blob(blobs[0], EXPECTED_BLOB)
