from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from mr_core.models.monitoring.monitoring_run import MonitoringRun
from playhouse.postgres_ext import JSONField


class MonitoringLog(ReadWriteModel):
    run = ForeignKeyField(MonitoringRun, backref='logs')
    timestamp = DateTimeField()
    level = CharField()  # info, warning, error
    message = TextField()
    metadata = JSONField(null=True)
