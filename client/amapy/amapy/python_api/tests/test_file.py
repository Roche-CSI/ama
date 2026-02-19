import pytest

from amapy.python_api.file import File


def test_str_returns_linked_path(tmp_path):
    test_path = tmp_path / "example.txt"
    file = File(path=str(test_path), linked_path=str(test_path), cloned=False, size=0)
    assert str(file) == str(test_path)


def test_open_reads_file_contents(tmp_path):
    test_path = tmp_path / "readme.txt"
    test_path.write_text("hello", encoding="utf-8")

    file = File(path=str(test_path), linked_path=str(test_path), cloned=False, size=test_path.stat().st_size)
    with file.open() as f:
        assert f.read() == "hello"
        assert not f.closed

    assert f.closed


def test_open_writes_file_contents(tmp_path):
    test_path = tmp_path / "write.txt"
    file = File(path=str(test_path), linked_path=str(test_path), cloned=False, size=0)

    with file.open(mode="w") as f:
        f.write("data")

    assert test_path.read_text(encoding="utf-8") == "data"
