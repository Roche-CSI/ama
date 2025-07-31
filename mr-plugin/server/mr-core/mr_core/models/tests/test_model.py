import os
import json
from mr_core.configs import Configs
from mr_core.configs.configs import ConfigModes
from mr_core.db import connect_to_db
from mr_core.models.asset_class import AssetClass

attributeKeys = [
    "license",
    "author",
    "type",
    "language",
    "tasks",
    "architecture",
    "parameters",
    "training_data",
    "evaluation_metrics",
    "example_inputs",
    "example_outputs",
]


def test_format_data():
    filepath = os.path.join(os.path.dirname(__file__), "models.json")
    data = None
    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            # Sentence Case
            record["title"] = record["title"].replace("_", " ").title()

    with open(filepath, "w") as file:
        json.dump(data, file, indent=4)


def test_create_records():
    cfg = Configs.shared(ConfigModes.DEV).DATABASE
    db = connect_to_db(cfg)
    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "models.json")
    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            record["project"] = "e8f7d1c1-df4a-4a1b-b8b8-8b2b0f90c3d2"
            existing = AssetClass.get_or_none(AssetClass.id == record["id"])
            if not existing:
                AssetClass.create(**record, user="system")



