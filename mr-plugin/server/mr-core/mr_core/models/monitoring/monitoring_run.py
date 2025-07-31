from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from mr_core.models.monitoring.monitoring_provider import MonitoringProvider
from playhouse.postgres_ext import JSONField


class MonitoringRun(ReadWriteModel):
    asset_id = CharField()  # Reference to your model registry model
    provider = ForeignKeyField(MonitoringProvider, backref='monitoring_runs')
    start_time = DateTimeField()
    end_time = DateTimeField(null=True)
    state = CharField()  # active, completed, failed
    configuration = JSONField(null=True)  # Run-specific configuration
    data_snapshot = JSONField(null=True)  # Reference data statistics/distribution
