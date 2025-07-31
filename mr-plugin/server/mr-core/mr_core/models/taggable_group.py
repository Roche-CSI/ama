from __future__ import annotations
import contextlib
from peewee import *
from .base.read_write import ReadWriteModel
import uuid
from datetime import datetime
import pytz
from playhouse.postgres_ext import JSONField
from mr_core.models.entity_group import EntityGroup


# Model for `TaggableGroup`
class TaggableGroup(ReadWriteModel):
    id = UUIDField(primary_key=True)
    name = CharField()
    entity_group_id = ForeignKeyField(EntityGroup, backref='taggable_group')
    entity_group_name = CharField()
    description = TextField(null=True)  # Optional field
    created_by = CharField()
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Consider using DateTimeField for actual date-time values
    modified_at = CharField()  # Consider using DateTimeField for actual date-time values
    
    # Many-to-Many relationship with TaggableCategory
    # categories = ForeignKeyField(taggable_catagory.TaggableCategory, backref='tag_group')

    def __repr__(self):
        return (f"<TaggableGroup(id={self.id}, name={self.name}, entity_group_id={self.entity_group_id}, "
                f"entity_group_name={self.entity_group_name}, description={self.description}, created_by={self.created_by}, "
                f"created_at={self.created_at}, modified_at={self.modified_at})>")
    

    @classmethod
    def create(cls, user=None, **query):
        return super(TaggableGroup, cls).create(user, **query)