import os
import json
from mr_core.configs.configs import Configs, ConfigModes
from mr_core.db import connect_to_db
from mr_core.models.actions.action_provider import ActionProvider
from mr_core.models.actions.action import Action
from mr_core.models.actions.asset_action import AssetAction
from mr_core.models.actions.action_run import ActionRun


def get_db():
    cfg = Configs.shared(ConfigModes.DEV).DATABASE
    db = connect_to_db(cfg)
    return db


def create_provider_records():
    _ = get_db()
    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "providers-data.json")
    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            record_data = {
                "name": record["name"],
                "title": record["title"],
                "description": record["description"],
                "url": record["url"],
                "is_active": record["is_active"],
                "configs": record["configs"],
            }
            existing = ActionProvider.get_or_none(ActionProvider.name == record["name"])
            if not existing:
                print("Creating record: ", record_data["name"])
                ActionProvider.create(**record_data, user="system")
            else:
                print("Record already exists: ", record_data["name"])
                existing.name = existing.name.lower().replace(" ", "_")
                existing.save(user="system")


def create_action_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "actions-data.json")

    with open(filepath, "r") as file:
        data = json.load(file)

    provider = ActionProvider.get(ActionProvider.name == "github")

    for record in data:
        record_data = {
            "provider_id": str(provider.id),  # Fixed key name
            "name": "_".join(record["name"].lower().split(" ")),
            "title": record["title"],
            "description": record["description"],
            "api_config": record["api_config"],
            "input_schema": record["input_schema"],
            "request_template": record["request_template"],
        }

        # Fixed query syntax
        existing = Action.get_or_none(
            (Action.provider_id == provider.id) &
            (Action.name == record_data["name"])
        )

        if not existing:
            print("Creating record: ", record_data["name"])
            Action.create(**record_data, user="system")  # Fixed model name
        else:
            print("Record already exists: ", record_data["name"])


def create_asset_action_records():
    db = get_db()  # Fixed syntax error with asterisk
    asset_id = "1d68cc07-cbae-4242-871b-434e48425601"

    for action in Action.select():
        asset_action = AssetAction.get_or_none(
            (AssetAction.asset_id == asset_id) &
            (AssetAction.action_id == action.id)
        )
        if not asset_action:
            print("Creating asset action record: ", action.name)
            configs = {
                "environment": "production",
                "metric_name": "precision",
                "current_value": 0.92,
                "previous_value": 0.95,
                "threshold": 0.94,
                "team_owner": "ml-team"
            },
            trigger_type = "automatic",
            trigger_condition = {
                "metric": "precision",
                "operator": "less_than",
                "threshold": 0.94,
                "window": "1h",
                "consecutive_breaches": 3
            }
            AssetAction.create(asset_id=asset_id,
                               action_id=action.id,
                               config=configs,
                               trigger_type=trigger_type,
                               trigger_condition=trigger_condition,
                               user="system")
        else:
            print("Record already exists: ", action.name)

def create_action_run_records():
    _ = get_db()
    filepath = os.path.join(os.path.dirname(__file__), "action-run-data.json")

    with open(filepath, "r") as file:
        data = json.load(file)
        for record in data:
            ActionRun.create(**record, user="system")





if __name__ == "__main__":
    create_action_run_records();
    # create_asset_action_records()
    # create_action_records()
    # create_provider_records()
