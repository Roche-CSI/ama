from __future__ import annotations
import contextlib
from peewee import *
from mr_core.models.taggable_catagory import TaggableCategory
from .base.read_write import ReadWriteModel
import uuid

class Tag(ReadWriteModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)  # UUID field with default generation
    name = CharField()
    category = ForeignKeyField(TaggableCategory, backref='tags')
    
    
    @classmethod
    def create(cls, user=None, **query):
        return super(Tag, cls).create(user, **query)