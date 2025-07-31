from peewee import *
import uuid
from mr_core.models import tag
from .base.read_write import ReadWriteModel
from datetime import datetime
import pytz
from mr_core.models.taggable_group import TaggableGroup


class TaggableCategory(ReadWriteModel):  # Assuming you have a BaseModel that extends Peewee's Model class
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    name = CharField()
    group_id = ForeignKeyField(TaggableGroup, backref='categories')  # Group i.e. 'deployment', 'project', 'task', 'model', UNIQUE=False
    group_name = CharField()  # Group name i.e. 'deployment', 'project', 'task', 'model', UNIQUE=False
    description = TextField(null=True)
    created_by = CharField()
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))
    modified_at = DateTimeField()
    readme_md = TextField(null=True)
    
    # one-to-many relationship with Tag model
    # tags = ForeignKeyField(tag.Tag, backref='tags')

    @classmethod
    def create(cls, user=None, **query):
        return super(TaggableCategory, cls).create(user, **query)