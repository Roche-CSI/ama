from unittest.mock import patch

from amapy.python_api.klass import Klass


def test_list(store):
    with patch("amapy.python_api.klass.AssetStore.shared", return_value=store):
        klass = Klass()
        class_list = klass.list()
        assert class_list and type(class_list) is dict


def test_info(store):
    with patch("amapy.python_api.klass.AssetStore.shared", return_value=store):
        klass = Klass()
        class_info = klass.info(class_name="test_class")
        assert type(class_info) is dict
        expected = ["name", "id", "created_at", "created_by", "class_type", "project"]
        for key in expected:
            assert key in class_info
