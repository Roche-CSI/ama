import json
import os
import tempfile

import yaml

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


def test_read_json(test_data):
    path = os.path.join(test_data, "write.json")
    data = FileUtils.read_json(path)
    assert isinstance(data, dict)
    assert "name" in data
    assert data["name"] == "asset-manager"


def test_write_json():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "out.json")
    payload = {"key": "value", "num": 42}
    FileUtils.write_json(data=payload, abs_path=path)
    assert os.path.exists(path)
    with open(path) as f:
        loaded = json.load(f)
    assert loaded["key"] == "value"
    assert loaded["num"] == 42


def test_read_yaml(test_data):
    path = os.path.join(test_data, "yamls", "invoice.yaml")
    data = FileUtils.read_yaml(path)
    assert data is not None
    assert isinstance(data, dict)


def test_write_yaml():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "out.yaml")
    payload = {"hello": "world", "items": [1, 2, 3]}
    FileUtils.write_yaml(abs_path=path, data=payload)
    assert os.path.exists(path)
    with open(path) as f:
        loaded = yaml.safe_load(f)
    assert loaded["hello"] == "world"
    assert loaded["items"] == [1, 2, 3]


def test_read_text():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "sample.txt")
    with open(path, "w") as f:
        f.write("a\nb\nc\n")
    lines = FileUtils.read_text(path, lines=True)
    assert isinstance(lines, list)
    assert len(lines) == 3


def test_write_and_read_file():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "archive.zip")
    FileUtils.write_file(abs_path=path, content="zipped content", compressed=True)
    assert os.path.exists(path)
    result = FileUtils.read_file(filepath=path, compressed=True)
    assert isinstance(result, dict)
    # The inner file should contain the original content
    inner = list(result.values())[0]
    assert b"zipped content" in inner


def test_write_and_read_zip_file():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "data.zip")
    FileUtils.write_zipfile(path=path, content="payload")
    result = FileUtils.read_zip_file(path=path)
    assert "data" in result  # inner filename derived from outer name minus .zip
    assert b"payload" in result["data"]


def test_url_safe_md5():
    # standard b64 with + and / should become - and _
    b64 = "XBo9UIOoHdGK4GLx+piBiA=="
    safe = FileUtils.url_safe_md5(b64)
    assert "+" not in safe
    assert "/" not in safe


def test_diff_file():
    tmp = tempfile.mkdtemp()
    f1 = os.path.join(tmp, "a.txt")
    f2 = os.path.join(tmp, "b.txt")
    with open(f1, "w") as f:
        f.write("line1\nline2\n")
    with open(f2, "w") as f:
        f.write("line1\nchanged\n")
    diff = FileUtils.diff_file(from_file=f1, to_file=f2, from_desc="a", to_desc="b")
    assert "-line2" in diff
    assert "+changed" in diff


def test_hard_link_file(test_data):
    src = os.path.join(test_data, "write.json")
    tmp = tempfile.mkdtemp()
    dst = os.path.join(tmp, "linked.json")
    FileUtils.hard_link_file(src=src, dst=dst)
    assert os.path.exists(dst)
    assert os.path.samefile(src, dst)


def test_sym_link_file(test_data):
    src = os.path.join(test_data, "write.json")
    tmp = tempfile.mkdtemp()
    dst = os.path.join(tmp, "symlinked.json")
    FileUtils.sym_link_file(src=src, dst=dst)
    assert os.path.islink(dst)
    assert os.path.realpath(dst) == os.path.realpath(src)


def test_write_binary():
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "binary.bin")
    content = b"\x00\x01\x02\xff"
    FileUtils.write_binary(dst=path, content=content)
    with open(path, "rb") as f:
        assert f.read() == content


def test_hex_to_base64():
    import base64
    raw = b"\xde\xad\xbe\xef"
    result = FileUtils.hex_to_base64(raw)
    assert result == base64.b64encode(raw).decode("ascii")

    # also accepts a string
    result_str = FileUtils.hex_to_base64("hello")
    assert isinstance(result_str, str)
