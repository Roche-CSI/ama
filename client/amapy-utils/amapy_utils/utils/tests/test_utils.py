import os.path
from pathlib import Path

import pytest
from datetime import UTC, datetime
from types import SimpleNamespace

from amapy_utils.utils import utils


def test_contains_special_chars():
    assert utils.contains_special_chars("valid_string") is False
    assert utils.contains_special_chars("invalid_string!") is True


def test_is_integer():
    assert utils.is_integer("10") is True
    assert utils.is_integer("10.5") is False
    assert utils.is_integer("not_a_number") is False


def test_convert_to_pst():
    utc_time = datetime(2020, 1, 1, 12, 0, tzinfo=UTC)
    pst_time = "2020/01/01 04-00-00 -0800"
    assert utils.convert_to_pst(utc_time) == pst_time


def test_convert_to_pst_daylight_saving():
    utc_time = datetime(2020, 7, 1, 12, 0, tzinfo=UTC)
    assert utils.convert_to_pst(utc_time) == "2020/07/01 05-00-00 -0700"


def test_convert_to_pst_daylight_saving_transition():
    before = datetime(2020, 11, 1, 8, 30, tzinfo=UTC)
    after = datetime(2020, 11, 1, 9, 30, tzinfo=UTC)
    assert utils.convert_to_pst(before) == "2020/11/01 01-30-00 -0700"
    assert utils.convert_to_pst(after) == "2020/11/01 01-30-00 -0800"


def test_time_now():
    now = utils.time_now()
    assert now.tzinfo is UTC
    assert now.microsecond == 0


def test_date_to_string():
    test_date = datetime(2020, 1, 1, 12, 0)
    assert utils.date_to_string(test_date) == "2020/01/01 12-00-00 "


def test_string_to_timestamp():
    now = utils.time_now()
    pst_now = utils.convert_to_pst(now)
    converted = utils.string_to_timestamp(pst_now)
    assert now.timestamp() == converted
    fallback_date = datetime(2020, 1, 1)
    assert utils.string_to_timestamp("2020-01-01T00-00-00-UTC") == fallback_date.timestamp()


def test_relative_path():
    # Assuming the function is in a file located at /path/to/your/project/utils/utils.py
    assert utils.relative_path("/path/to/your/project/utils", "/path/to/your") == "project/utils"


def test_remove_prefix():
    assert utils.remove_prefix("TestString", "Test") == "String"
    assert utils.remove_prefix("SomeString", "NonExisting") == "SomeString"


def test_remove_suffix():
    assert utils.remove_suffix("TestString", "String") == "Test"
    assert utils.remove_suffix("SomeString", "NonExisting") == "SomeString"


def test_find_pattern():
    assert utils.find_pattern("example*") == "*"
    assert utils.find_pattern("test?") == "?"
    assert utils.find_pattern("list[item]") == "[item]"
    assert utils.find_pattern("example") is None
    assert utils.find_pattern("*example") == "*example"
    assert utils.find_pattern("*?*") == "*?*"


def test_list_files(project_root, test_data):
    locations = [
        (project_root, "*.py", True, ".py"),
        (os.path.join(project_root, "test_data"), "imgs", False),
        (os.path.join(project_root, "test_data"), "imgs*", True, ".jpg"),
    ]

    for path in locations:
        files_list = utils.list_files(root_dir=path[0], pattern=path[1])
        if not path[2]:
            assert len(files_list) == 0
        else:
            for file_path in files_list:
                assert os.path.splitext(file_path)[1] == path[3]
