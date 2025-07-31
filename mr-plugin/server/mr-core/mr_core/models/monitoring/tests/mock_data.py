import os
import json
from mr_core.configs.configs import Configs, ConfigModes
from mr_core.db import connect_to_db
from mr_core.models.actions.action_run import ActionRun
from mr_core.models import MonitoringProvider, MonitoringRun, MonitoringMetrics, MonitoringLog, MonitoringAlert, MonitoringThreshold


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
                "name": record["name"],
                "title": record["title"],
                "description": record["description"],
                "url": record["url"],
                "is_active": record["is_active"],
                "configs": record["configs"],
            }
            existing = MonitoringProvider.get_or_none(MonitoringProvider.name == record["name"])
            if not existing:
                print("Creating record: ", record_data["name"])
                MonitoringProvider.create(**record_data, user="system")
            else:
                print("Record already exists: ", record_data["name"])
                existing.name = existing.name.lower().replace(" ", "_")
                existing.save(user="system")


def create_run_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "run-data.json")

    with open(filepath, "r") as file:
        data = json.load(file)

    for record in data:
        record_data = {
            "provider_id": record["provider_id"],  # Fixed key name
            "asset_id": record["asset_id"],
            "start_time": record["start_time"],
            "end_time": record["end_time"],
            "state": record["status"],
            "configuration": record["configuration"],
            "data_snapshot": record["data_snapshot"]
        }

        # Fixed query syntax
        existing = MonitoringRun.get_or_none(
            (MonitoringRun.provider_id == record["provider_id"]) &
            (MonitoringRun.asset_id == record_data["asset_id"])
        )

        if not existing:
            print("Creating record: ", record_data["provider_id"], record_data["asset_id"])
            MonitoringRun.create(**record_data, user="system")  # Fixed model name
        else:
            print("Record already exists: ", record_data["provider_id"], record_data["asset_id"])


def create_threshold_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "threshold-data.json")
    run_id = "e93a6894-f36e-4217-b0ab-83792c92d965"

    with open(filepath, "r") as file:
        data = json.load(file)

    for record in data:
        record.pop("id")
        record["run_id"] = run_id

        # Fixed query syntax
        existing = MonitoringThreshold.get_or_none(
            (MonitoringThreshold.run_id == run_id) &
            (MonitoringThreshold.metric_type == record["metric_type"]) &
            (MonitoringThreshold.metric_name == record["metric_name"])
        )

        if not existing:
            print("Creating record: ", record["metric_name"], record["metric_type"])
            MonitoringThreshold.create(**record, user="system")
        else:
            print("Record already exists: ", run_id, record["metric_name"], record["metric_type"])


def create_metric_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "metric-data.json")
    run_id = "e93a6894-f36e-4217-b0ab-83792c92d965"

    with open(filepath, "r") as file:
        data = json.load(file)

    for record in data:
        record.pop("id")
        record["run_id"] = run_id

        # Fixed query syntax
        existing = MonitoringMetrics.get_or_none(
            (MonitoringMetrics.run_id == run_id) &
            (MonitoringMetrics.timestamp == record["timestamp"]) &
            (MonitoringMetrics.category == record["category"]) &
            (MonitoringMetrics.metric_type == record["metric_type"]) &
            (MonitoringMetrics.metric_name == record["metric_name"])
        )

        if not existing:
            print("Creating record: ", record["metric_name"], record["metric_type"])
            MonitoringMetrics.create(**record, user="system")
        else:
            print("Record already exists: ", run_id, record["metric_name"], record["metric_type"])


def create_alert_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "alert-data.json")
    run_id = "e93a6894-f36e-4217-b0ab-83792c92d965"

    with open(filepath, "r") as file:
        data = json.load(file)

    # get metric records
    metric_records = MonitoringMetrics.select().where(MonitoringMetrics.run_id == run_id).dicts()

    for idx, record in enumerate(data):
        record.pop("id")
        record["run_id"] = run_id
        record["metric_record_id"] = metric_records[idx]["id"]

    for record in data:
        # Fixed query syntax
        existing = MonitoringAlert.get_or_none(
            (MonitoringAlert.run_id == run_id) &
            (MonitoringAlert.metric_record_id == record["metric_record_id"])
        )

        if not existing:
            print("Creating record: ", record["run_id"], record["metric_record_id"])
            MonitoringAlert.create(**record, user="system")
        else:
            print("Record already exists: ", run_id, record["metric_record_id"])


def create_log_records():
    db = get_db()  # Fixed syntax error with asterisk

    # Create records
    filepath = os.path.join(os.path.dirname(__file__), "log-data.json")
    run_id = "e93a6894-f36e-4217-b0ab-83792c92d965"

    with open(filepath, "r") as file:
        data = json.load(file)

    for record in data:
        # Fixed query syntax
        record.pop("id")
        record["run_id"] = run_id
        existing = MonitoringLog.get_or_none(
            (MonitoringLog.run_id == run_id) &
            (MonitoringLog.timestamp == record["timestamp"]) &
            (MonitoringLog.message == record["message"])
        )

        if not existing:
            print("Creating record: ", record["run_id"], record["message"])
            MonitoringLog.create(**record, user="system")
        else:
            print("Record already exists: ", run_id, record["message"])

if __name__ == "__main__":
    # create_provider_records()
    # create_run_records()
    # create_threshold_records()
    # create_metric_records()
    # create_alert_records()
    create_log_records()
