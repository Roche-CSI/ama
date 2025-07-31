from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel
from datetime import datetime
import pytz


class MlModel(ReadWriteModel):
    id = CharField(primary_key=True)
    name = CharField()
    description = TextField(null=True)  # Optional field
    tags = JSONField()  # List of strings
    license = CharField()
    author = CharField()
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Use DateTimeField for actual date-time values
    modified_at = CharField(null=True)  # Optional field, use DateTimeField for actual date-time values
    downloads = IntegerField()
    likes = IntegerField()
    type = CharField()
    language = CharField()
    tasks = JSONField()  # List of strings
    architecture = CharField()
    parameters =JSONField()
    training_data = JSONField()
    evaluation_metrics = JSONField()
    example_inputs = JSONField()  # List of strings
    example_outputs = JSONField()  # List of strings


    @classmethod
    def create(cls, user=None, **query):
        return super(MlModel, cls).create(user, **query)