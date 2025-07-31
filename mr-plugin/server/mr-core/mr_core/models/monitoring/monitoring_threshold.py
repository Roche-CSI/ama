from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from mr_core.models.monitoring.monitoring_run import MonitoringRun
from playhouse.postgres_ext import JSONField


class MonitoringThreshold(ReadWriteModel):
    run = ForeignKeyField(MonitoringRun, backref='thresholds')
    metric_type = CharField()
    metric_name = CharField()
    threshold_value = FloatField()
    comparison_operator = CharField()  # >, <, >=, <=, ==
    severity = CharField()  # warning, critical
    enabled = BooleanField(default=True)
    metadata = JSONField(null=True)

    class Meta:
        indexes = (
            (('run', 'metric_type', 'metric_name'), False),
        )