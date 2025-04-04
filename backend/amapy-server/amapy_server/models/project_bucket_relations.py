from peewee import ForeignKeyField, BooleanField
from playhouse.postgres_ext import JSONField

from .base.read_write import ReadWriteModel
from .bucket import Bucket
from .project import Project


class ProjectBucketRelations(ReadWriteModel):
    """Join table for asset-object relations
    """
    project = ForeignKeyField(Project, backref="bucket_joins", null=False, on_delete='CASCADE')
    bucket = ForeignKeyField(Bucket, backref="project_joins", null=False, on_delete='CASCADE')
    # different projects can have different configs such as credentials, access permissions etc
    configs = JSONField(null=True, default=dict)
    is_primary = BooleanField(null=False, default=False)

    class Meta:
        indexes = ((('project', 'bucket'), True),)
