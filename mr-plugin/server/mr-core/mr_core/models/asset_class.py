from peewee import *
from playhouse.postgres_ext import JSONField
from .base.base import BaseModel
from .project import Project


class AssetClass(BaseModel):
    project = ForeignKeyField(Project, backref='asset_classes', on_delete='CASCADE', null=False)
    name = CharField(unique=False)
    counter = IntegerField(default=0)
    owner = CharField(null=False)
    title = CharField(null=False, default="n/a")
    description = TextField(null=False, default="n/a")
    readme = TextField(null=True)
    class_type = CharField(null=False, default="n/a")
    attributes = JSONField(default=dict)  # attributes of the asset class
    metadata = JSONField(null=True, default=dict)  # additional metadata
    tags = JSONField(null=True, default=list)

    class Meta:
        indexes = (
            (('project', 'name'), True),
        )

    @classmethod
    def create(cls, user=None, **query):
        query["owner"] = query.get("owner", user)
        return super(AssetClass, cls).create(user, **query)

    @classmethod
    def serialize_fields(cls):
        return [
            "id",
            "name",
            "project",
            "created_at",
            "created_by",
            "owner",
            "title",
            "description",
            "class_type",
            "modified_at",
            "modified_by",
            "attributes",
            "status",
            "metadata"
        ]


