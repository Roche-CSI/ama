import os

from asset_client.asset import Asset
from asset_client.dict_diff import compute_dict_patch
from deepdiff import Delta, DeepDiff

from utils.file_utils import FileUtils


def assets_data():
    """need the test_app fixture for making db transactions"""
    path = os.path.join(os.path.dirname(__file__), "test_data.json")
    path2 = os.path.join(os.path.dirname(__file__), "test_data2.json")
    return FileUtils.read_json(path), FileUtils.read_json(path2)


def test_compute_dict_patch(test_user, test_app):
    data1, data2 = assets_data()
    asset1 = Asset(user=test_user, data=data1)
    asset2 = Asset(user=test_user, data=data2)
    # diff = compute_dict_patch(asset1.objects.serialize(), asset2.objects.serialize())

    ddiff = DeepDiff(asset1.objects.serialize(), asset2.objects.serialize())
    print(ddiff.to_json_pickle())
    jsoned = ddiff.to_json()

    retrieved = DeepDiff.from_json_pickle(ddiff.to_json_pickle())
    print(type(retrieved))
    assert retrieved == ddiff
