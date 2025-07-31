from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel
# from mr_core.models import machine_configuration
from datetime import datetime, timezone
import uuid
import pytz
# from mr_core.models import metrics


class Deployment(ReadWriteModel):
    id = UUIDField(primary_key=True)
    name = CharField()
    description = TextField(null=True)  # Optional field
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Use DateTimeField for actual date-time values
    updated_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))   # Optional field, use DateTimeField for actual date-time values
    url = CharField()
    model_id = UUIDField()
    user_username = CharField()
    machine_config = JSONField()
    status = CharField(choices=[('pending', 'Pending'), ('active', 'Active'), ('failed', 'Failed'), ('completed', 'Completed')])
    logs_url = CharField(null=True)  # Optional field
    metrics = JSONField()
    deployment_environment = CharField(choices=[('Kubernetes', 'Kubernetes'), ('VM', 'VM'), ('SHPC', 'SHPC')])
    tags = JSONField(null=True)  # Optional array of tags or keywords
    
    @classmethod
    def create(cls, user=None, **query):
        return super(Deployment, cls).create(user, **query)
