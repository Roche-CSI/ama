from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from playhouse.postgres_ext import JSONField


class MonitoringProvider(ReadWriteModel):
    """
    Represents different action providers (GitHub, Jira, Trello, etc.)
    """
    name = CharField(unique=True)  # e.g., 'github', 'jira', 'trello'
    title = CharField()  # e.g., 'GitHub', 'Jira', 'Trello'
    description = TextField(null=True)
    url = CharField(null=True)
    is_active = BooleanField(default=True)
    configs = JSONField(null=True, default=dict)  # JSON Schema for provider configuration, Provider-specific configuration schema

    class Meta:
        indexes = (
            (('name',), True),
        )