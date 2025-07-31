import os
import json
from mr_core.configs.configs import Configs, ConfigModes
from mr_core.db import connect_to_db
from mr_core.models.actions.action_provider import ActionProvider
from mr_core.models.actions.action import Action
from mr_core.models.actions.asset_action import AssetAction
from mr_core.models.actions.action_run import ActionRun
from mr_core.models.experiments.experiment_provider import ExperimentProvider
from mr_core.models.experiments.model_experiment import ModelExperiment


def get_db():
    cfg = Configs.shared(ConfigModes.DEV).DATABASE
    db = connect_to_db(cfg)
    return db


def create_provider_records():
    _ = get_db()
    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "provider-data.json")
    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            record_data = {
                "name": record["name"].lower().replace(" ", "_"),
                "title": record["title"],
                "description": record["description"],
                "url": record["url"],
                "is_active": record["is_active"],
                "configs": record["configs"],
            }
            existing = ExperimentProvider.get_or_none(ExperimentProvider.name == record["name"])
            if not existing:
                print("Creating record: ", record_data["name"])
                ExperimentProvider.create(**record_data, user="system")
            else:
                print("Record already exists: ", record_data["name"])
                existing.name = existing.name.lower().replace(" ", "_")
                existing.save(user="system")


def create_experiment_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "experiments-data.json")

    with open(filepath, "r") as file:
        data = json.load(file)

    provider = ExperimentProvider.get(ExperimentProvider.name == "wandb")
    asset_id = "1d68cc07-cbae-4242-871b-434e48425601"

    for record in data:
        record_data = {
            "provider_id": str(provider.id),  # Fixed key name
            "asset_id": asset_id,
            "experiment_id": record.pop("id"),
            "data": record
        }

        # Fixed query syntax
        existing = ModelExperiment.get_or_none(
            (ModelExperiment.provider == provider.id) &
            (ModelExperiment.experiment_id == record_data["experiment_id"]) &
            (ModelExperiment.asset_id == record_data["asset_id"])
        )

        if not existing:
            print("Creating record: ", record_data["experiment_id"])
            ModelExperiment.create(**record_data, user="system")  # Fixed model name
        else:
            print("Record already exists: ", record_data["experiment_id"])


if __name__ == "__main__":
    # create_action_run_records();
    # create_asset_action_records()
    create_experiment_records()
    # create_provider_records()
