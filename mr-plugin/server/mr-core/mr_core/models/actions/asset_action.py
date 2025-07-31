from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from playhouse.postgres_ext import JSONField
from .action import Action


class AssetAction(ReadWriteModel):
    """
    Associates actions with specific models in your registry
    """
    asset_id = CharField()  # Reference to your model registry
    action = ForeignKeyField(Action, backref='asset_actions')

    # Configuration for this specific action instance
    config = JSONField()  # Configured values matching action's input_schema

    # Trigger conditions
    trigger_type = CharField()  # e.g., 'manual', 'automatic', 'scheduled'
    trigger_condition = JSONField(null=True)  # Conditions for automatic triggers