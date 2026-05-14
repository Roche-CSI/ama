from amapy_server.configs.configs import Configs


def test_instance_creation():
    config = Configs.shared()
    assert config.bucket_url() == "gs://test-bucket/test"
    assert config.bucket_url(staging=True) == "gs://test-bucket/staging"
    assert config.contents_url(staging=False) == "gs://test-bucket/test/contents"
    assert config.contents_url(staging=True) == "gs://test-bucket/staging/contents"
    assert config.assets_url == "gs://test-bucket/test/assets"
