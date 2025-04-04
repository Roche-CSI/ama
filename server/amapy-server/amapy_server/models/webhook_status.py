from peewee import *
from playhouse.postgres_ext import JSONField

from amapy_server.models.base.read_only import ReadOnlyModel
from amapy_server.models.webhook import Webhook


class WebhookStatus(ReadOnlyModel):
    webhook = ForeignKeyField(Webhook, backref='statuses', on_delete='CASCADE', null=False)
    status = CharField(null=True)  # success, failure, timeout etc
    payload = JSONField(null=True)  # request payload
    response = TextField(null=True)  # error message, etc.
