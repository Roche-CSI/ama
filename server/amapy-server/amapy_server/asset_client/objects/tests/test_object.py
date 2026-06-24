"""Tests for amapy_server.asset_client.objects.object.Object"""
from unittest.mock import MagicMock

import pytest

from amapy_server.asset_client.contents.content import Content
from amapy_server.asset_client.contents.gcs_content import GcsContent
from amapy_server.asset_client.objects.object import Object


@pytest.fixture
def mock_blob():
    blob = MagicMock()
    blob.md5_hash = "placeholder_md5hash=="
    blob.content_type = "image/jpeg"
    blob.crc32c = None
    return blob


@pytest.fixture
def content(client_asset, mock_blob):
    hash_type, hash_value = GcsContent.compute_hash(src=mock_blob)
    return GcsContent(
        hash_type=hash_type,
        hash_value=hash_value,
        hash=GcsContent.serialize_hash(hash_type, hash_value),
        mime=mock_blob.content_type,
        asset=client_asset,
    )


@pytest.fixture
def obj(client_asset, content):
    return Object(
        id=Object.create_id(content, "data/image.jpg"),
        url_id=1,
        content=content,
        created_by="user1",
        created_at="2024/01/01 00-00-00 -0700",
        asset=client_asset,
    )


def test_init(client_asset, content):
    """All fields are stored and the object registers itself with its content."""
    o = Object(
        id=Object.create_id(content, "some/file.txt"),
        url_id=42,
        content=content,
        created_by="user1",
        created_at="2024/01/01 00-00-00 -0700",
        asset=client_asset,
    )
    assert o.id == Object.create_id(content, "some/file.txt")
    assert o.url_id == 42
    assert o.content is content
    assert o.created_by == "user1"
    assert o.created_at == "2024/01/01 00-00-00 -0700"
    assert o.asset is client_asset
    assert o in content.linked_objects


def test_create_id(content):
    """create_id builds a composite id from a Content or string, and parse_id reverses it."""
    path = "mypath/ab.img"
    # from a Content object
    object_id = Object.create_id(content, path)
    assert object_id == f"{content.id}{Object.ID_SEP}{path}"
    # from a raw string
    raw_id = "gs:md5_placeholder_id_001=="
    assert Object.create_id(raw_id, path) == f"{raw_id}{Object.ID_SEP}{path}"
    # parse_id round-trip
    parts = Object.parse_id(object_id)
    assert parts[0] == content.id and parts[1] == path


def test_serialize(obj):
    """serialize() returns a dict with exactly the declared fields, content as a dict."""
    data = obj.serialize()
    assert set(data.keys()) == set(Object.serialize_fields())
    assert data["id"] == obj.id
    assert data["created_by"] == obj.created_by
    assert data["created_at"] == obj.created_at
    assert isinstance(data["content"], dict)
    assert data["content"] == obj.content.serialize()


def test_de_serialize(client_asset, obj):
    """de_serialize round-trips all fields and attaches the correct asset and content."""
    data = obj.serialize()
    data["url_id"] = obj.url_id  # url_id is not in serialize_fields
    restored = Object.de_serialize(asset=client_asset, data=data)
    assert isinstance(restored, Object)
    assert restored.id == obj.id
    assert restored.path == obj.path
    assert restored.created_by == obj.created_by
    assert restored.created_at == obj.created_at
    assert isinstance(restored.content, Content)
    assert restored.content.id == obj.content.id
    assert restored.asset is client_asset
