from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from mr_core.models.monitoring.monitoring_run import MonitoringRun
from playhouse.postgres_ext import JSONField


class MonitoringMetrics(ReadWriteModel):
    run = ForeignKeyField(MonitoringRun, backref='metrics')
    timestamp = DateTimeField()
    category = CharField()  # drift, performance, health, quality
    metric_type = CharField()  # feature_drift, target_drift, accuracy, latency, etc.
    metric_name = CharField()  # specific metric name
    metric_value = FloatField(null=True)
    metric_details = JSONField(null=True)  # Additional metric-specific data
    dimensions = JSONField(null=True)  # For multi-dimensional metrics (e.g., per-feature metrics)
    metadata = JSONField(null=True)  # Any additional provider-specific data

    class Meta:
        indexes = (
            (('run', 'timestamp', 'category', 'metric_type', 'metric_name'), False),
        )