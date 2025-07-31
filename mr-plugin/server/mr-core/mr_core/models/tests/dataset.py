import os
import json
from mr_core.configs import Configs
from mr_core.configs.configs import ConfigModes
from mr_core.db import connect_to_db
from mr_core.models.asset_class import AssetClass
from mr_core.utils.file_utils import FileUtils

attributeKeys = [
    "license",
    "num_records",
    "size",
    "format",
    "url",
    "version",
]

unwantedKeys = [
    "downloads",
    "likes"
]

def test_format_data():
    filepath = os.path.join(os.path.dirname(__file__), "datasets.json")
    data = FileUtils.read_json(filepath)
    data2 = FileUtils.read_json(os.path.join(os.path.dirname(__file__), "d2.json"))
    for record in data:
        # filter by id from data2
        record2 = list(filter(lambda x: x["id"] == record["id"], data2))[0]
        record["attributes"]["license"] = record2["license"]

    FileUtils.write_json(data=data, abs_path=filepath)


def test_create_records():
    cfg = Configs.shared(ConfigModes.DEV).DATABASE
    db = connect_to_db(cfg)
    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "datasets.json")
    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            record["project"] = "e8f7d1c1-df4a-4a1b-b8b8-8b2b0f90c3d2"
            record["status"] = 1
            existing = AssetClass.get_or_none(AssetClass.id == record["id"])
            if not existing:
                AssetClass.create(**record, user="system")

def test_update_records():
    cfg = Configs.shared(ConfigModes.DEV).DATABASE
    db = connect_to_db(cfg)
    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "datasets.json")
    data = FileUtils.read_json(filepath)
    for record in data:
        existing = AssetClass.get_or_none(AssetClass.id == record["id"])
        if existing:
            existing.attributes = record["attributes"]
            existing.save(user="system")

