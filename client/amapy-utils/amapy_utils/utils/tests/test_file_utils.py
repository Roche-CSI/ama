import os
import tempfile

from amapy_utils.utils import list_files
from amapy_utils.utils.file_utils import FileUtils
from amapy_utils.utils.stat_utils import FIELDS


def test_hardlink_directories(test_data):
    temp_dir = tempfile.mkdtemp()
    FileUtils.hardlink_directories(src_dir=test_data, dst_dir=temp_dir)
    linked = list_files(temp_dir)
    source_files = list_files(test_data)
    for file in source_files:
        target = os.path.join(temp_dir, os.path.relpath(file, test_data))
        assert target in linked and os.path.samefile(file, target)


def test_mime_type():
    expected_mimes = {
        "data.json": "application/json",
        "readme.txt": "text/plain",
        "data.h5": "application/x-hdf5",
        "data.yaml": "application/x-yaml",
        "data.yml": "application/x-yaml",
        "readme.md": "text/markdown",
        "photo.jpg": "image/jpeg",
    }
    for filename, expected in expected_mimes.items():
        mime = FileUtils.mime_type(filename)
        assert mime == expected, f"Expected '{expected}' for '{filename}', got '{mime}'"


def test_read_yaml_multi(test_data):
    files = list_files(test_data, pattern="*.yaml")
    data = FileUtils.read_yamls_multi(files)
    for file in files:
        assert file in data
        assert data[file] is not None


def test_file_stat(test_data):
    files = list_files(test_data)
    for file in files:
        stats = FileUtils.file_stat(file)
        for field in FIELDS:
            assert field in stats


def test_get_mount(project_root):
    test_data = os.path.join(project_root, "test_data", "file_cloning")
    path = os.path.join(test_data, "data.json")
    mount = FileUtils.get_mount(path)
    assert mount == "/"


def test_file_hash(test_data):
    expected = [
        {"path": "yamls/model.yml",
         "hashes": {'md5': 'l6BTlxCz4Y2ZfKapM248BQ==', 'crc32c': 'MF40IQ=='}},
        {"path": "yamls/invoice.yaml",
         "hashes": {'md5': 'XBo9UIOoHdGK4GLx+piBiA==', 'crc32c': 'Z/KSgw=='}},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "hashes": {'md5': 'vlyBXBn3+A99jGAicoEw3g==', 'crc32c': 'yPffHw=='}},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "hashes": {'md5': 'jeujRNnpO16Vq5kZzKPtwA==', 'crc32c': 'aT02+w=='}},
    ]

    for file in expected:
        file_path = os.path.join(test_data, file["path"])
        md5_hash = FileUtils.file_hash(abs_path=file_path, hash_type="md5")
        assert md5_hash[1] == file["hashes"]["md5"]

        crc32c_hash = FileUtils.file_hash(abs_path=file_path, hash_type="crc32c")
        assert crc32c_hash[1] == file["hashes"]["crc32c"]


def test_bytes_hash(test_data):
    expected = [
        {"path": "yamls/model.yml",
         "hashes": {'md5': 'l6BTlxCz4Y2ZfKapM248BQ==', 'crc32c': 'MF40IQ=='}},
        {"path": "yamls/invoice.yaml",
         "hashes": {'md5': 'XBo9UIOoHdGK4GLx+piBiA==', 'crc32c': 'Z/KSgw=='}},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "hashes": {'md5': 'vlyBXBn3+A99jGAicoEw3g==', 'crc32c': 'yPffHw=='}},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "hashes": {'md5': 'jeujRNnpO16Vq5kZzKPtwA==', 'crc32c': 'aT02+w=='}},
    ]

    for file in expected:
        file_path = os.path.join(test_data, file["path"])
        with open(file_path, 'rb') as f:
            data = f.read()
            md5_hash = FileUtils.bytes_hash(file_bytes=data, hash_type="md5")
            assert md5_hash[1] == file["hashes"]["md5"]

            crc32c_hash = FileUtils.bytes_hash(file_bytes=data, hash_type="crc32c")
            assert crc32c_hash[1] == file["hashes"]["crc32c"]
