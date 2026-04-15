import os
import tempfile

import pytest

from amapy.python_api.artifact import Artifact, File
from amapy_utils.common import exceptions


def test_fixtures(asset_root, repo, asset, store, empty_asset):
    """Verify that all conftest fixtures are created properly."""
    assert asset_root and os.path.isdir(asset_root)
    assert repo is not None
    assert asset is not None
    assert store is not None
    assert empty_asset is not None


def test_init():
    # Should raise exception if path is missing or None
    with pytest.raises(Exception) as e:
        Artifact(path=None)
    assert e.type == exceptions.AssetException

    # also raise exception if not a valid repo
    temp_dir = tempfile.mkdtemp()
    try:
        with pytest.raises(Exception) as e:
            Artifact(path=temp_dir)
        assert e.type == exceptions.NotAssetRepoError
    finally:
        os.rmdir(temp_dir)


def test_info(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    info = artifact.info
    info_keys = ["asset", "objects"]
    for key in info_keys:
        assert key in info

    # objects
    object_keys = ["linked_path", "path", "size", "cloned"]
    for item in info.get("objects"):
        for key in object_keys:
            assert key in item


def test_versions(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    versions = artifact.versions
    assert versions is None  # local asset


def test_history(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    history = artifact.history
    assert history is None  # local asset


def test_status(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    status = artifact.status
    status_keys = ["staged_changes", "unstaged_changes", "untracked_changes"]
    for key in status_keys:
        assert key in status


def test_files(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    files = artifact.files
    for item in files.values():
        assert isinstance(item, File)


def test_read_file(asset):
    artifact = Artifact(path=asset.repo.fs_path)
    files = artifact.files
    for item in files.values():
        with item.open() as f:
            file_contents = f.read()
            assert file_contents is not None
