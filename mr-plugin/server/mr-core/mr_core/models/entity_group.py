from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel
from datetime import datetime
import uuid
import pytz



# Model for `EntityGroup`
class EntityGroup(ReadWriteModel):
    id = UUIDField(primary_key=True)
    name = CharField(unique=True)  # Unique field
    description = TextField(null=True)  # Optional field
    created_by = CharField()
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Consider using DateTimeField for actual date-time values
    modified_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc)) # Consider using DateTimeField for actual date-time values

    # # One-to-Many relationship with TaggableGroup
    # groups = JSONField(default=list)

    def __repr__(self):
        return (f"<EntityGroup(id={self.id}, name={self.name}, description={self.description}, "
                f"created_by={self.created_by}, created_at={self.created_at}, modified_at={self.modified_at})>")
    
    @classmethod
    def create(cls, user=None, **query):
        return super(EntityGroup,cls).create(user, **query)