from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel
from datetime import datetime
import uuid
import pytz


class Project(ReadWriteModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)  # UUID field with default generation
    name = CharField(null=False, unique=True)
    title = CharField(null=True, unique=True)
    description = TextField(null=True, unique=False)
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Consider using DateTimeField for actual date-time values
    url = CharField()
    data_types = JSONField()  # List of strings
    admin = CharField()
    created_by = CharField()
    readme_md = TextField()  # Markdown content

    class Meta:
        indexes = (
            (('name',), True),
        )

    @classmethod
    def create(cls, user=None, **query):
        return super(Project,cls).create(user, **query)