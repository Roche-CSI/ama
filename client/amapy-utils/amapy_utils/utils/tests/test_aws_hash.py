import os

from amapy_utils.utils import aws_hash


def test_md5_checksum(test_data):
    paths = [
        ("yamls/model.yml", "4bb5142fc895507c983b4903016a7c11-1"),
        ("yamls/invoice.yaml", "de35da3fe9c4756754b11e9d24d14c86-1"),
    ]
    for path, etag in paths:
        file_path = os.path.join(test_data, path)
        assert aws_hash.calculate_etag(filepath=file_path) == etag


def test_file_etags(test_data):
    expected = [
        {"path": "yamls/model.yml",
         "hash": ('etag', '"4bb5142fc895507c983b4903016a7c11-1"')},
        {"path": "yamls/invoice.yaml",
         "hash": ('etag', '"de35da3fe9c4756754b11e9d24d14c86-1"')},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "hash": ('etag', '"ed578aa7d3c0cd9c27406f4e450028cc-3"')},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "hash": ('etag', '"dda861078f143d6ce13c0ff22ff3a650-2"')},
    ]
    for file in expected:
        file_path = os.path.join(test_data, file["path"])
        file_etags = aws_hash.file_etags(filepath=file_path, etag=file["hash"][1])
        assert aws_hash.compare_etags(file["hash"], file_etags) is True


def test_bytes_etags(test_data):
    expected = [
        {"path": "yamls/model.yml",
         "hash": ('etag', '"4bb5142fc895507c983b4903016a7c11-1"')},
        {"path": "yamls/invoice.yaml",
         "hash": ('etag', '"de35da3fe9c4756754b11e9d24d14c86-1"')},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "hash": ('etag', '"ed578aa7d3c0cd9c27406f4e450028cc-3"')},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "hash": ('etag', '"dda861078f143d6ce13c0ff22ff3a650-2"')},
    ]
    for file in expected:
        file_path = os.path.join(test_data, file["path"])
        with open(os.path.join(test_data, file_path), 'rb') as f:
            file_etags = aws_hash.bytes_etags(file_bytes=f.read(), etag=file["hash"][1])
            assert aws_hash.compare_etags(file["hash"], file_etags) is True


def test_compare_etags():
    src_etag = ('etag', '"4bb5142fc895507c983b4903016a7c11-1"')
    dst_etags = ('etag', ['4bb5142fc895507c983b4903016a7c11-1', '4bb5142fc'])
    assert aws_hash.compare_etags(src_etag, dst_etags) is True

    dst_etags = ('etag', ['4bb5142fc'])
    assert aws_hash.compare_etags(src_etag, dst_etags) is False

    dst_etags = ('md5', 'l6BTlxCz4Y2ZfKapM248BQ==')
    assert aws_hash.compare_etags(src_etag, dst_etags) is False


def test_file_etag(test_data):
    expected = [
        {"path": "yamls/model.yml",
         "part_size": 483,
         "hash": ('etag', '"4bb5142fc895507c983b4903016a7c11-1"')},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "part_size": 8388608,
         "hash": ('etag', '"ed578aa7d3c0cd9c27406f4e450028cc-3"')},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "part_size": 8388608,
         "hash": ('etag', '"dda861078f143d6ce13c0ff22ff3a650-2"')},
        {"path": "yamls/model.yml",
         "part_size": 0,
         "hash": ('etag', '"97a0539710b3e18d997ca6a9336e3c05"')},
        {"path": "imgs/photo-1541698444083-023c97d3f4b6.jpg",
         "part_size": 0,
         "hash": ('etag', '"8deba344d9e93b5e95ab9919cca3edc0"')},
        {"path": "imgs/photo-1513938709626-033611b8cc03.jpg",
         "part_size": 0,
         "hash": ('etag', '"be5c815c19f7f80f7d8c6022728130de"')},
    ]
    for file in expected:
        file_path = os.path.join(test_data, file["path"])
        got_etag = aws_hash.file_etag(filepath=file_path, part_size=file["part_size"])
        assert got_etag == file["hash"]
