from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from mr_core.models.monitoring.monitoring_run import MonitoringRun
from mr_core.models.monitoring.monitoring_metrics import MonitoringMetrics
from playhouse.postgres_ext import JSONField


class MonitoringAlert(ReadWriteModel):
    run = ForeignKeyField(MonitoringRun, backref='alerts')
    metric_record = ForeignKeyField(MonitoringMetrics, null=True, backref='alerts')
    timestamp = DateTimeField()
    severity = CharField()  # info, warning, critical
    category = CharField()  # drift, performance, health, quality
    message = TextField()
    metadata = JSONField(null=True)
    resolved = BooleanField(default=False)
    resolved_at = DateTimeField(null=True)