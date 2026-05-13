from amapy_server.asset_client.contents.gcs_content import GcsContent

DATA = {
    "id": "gs:md5_1Ab2Cd3Ef4Gh5Ij6Kl7mno==",
    "mime_type": "text/plain",
    "hash": "md5_1Ab2Cd3Ef4Gh5Ij6Kl7mno==",
    "size": 56839,
    "meta": {
        "src": "gs://bucket/test/client/asset_classes/00000000-000f-00b0-b0f0-0000000000a0.yaml",
        "proxy": True
    },
    "created_by": "user1",
    "created_at": '2021/10/27 10-24-06 PDT'
}


def test_can_stage(client_asset):
    asset = client_asset
    content = GcsContent.de_serialize(asset, DATA)
    assert content.id == "gs:md5_1Ab2Cd3Ef4Gh5Ij6Kl7mno=="
    assert content.hash == "md5_1Ab2Cd3Ef4Gh5Ij6Kl7mno=="
    assert content.hash_type == "md5"
    assert content.hash_value == "1Ab2Cd3Ef4Gh5Ij6Kl7mno=="
    assert not content.can_stage
    assert not content.can_commit
