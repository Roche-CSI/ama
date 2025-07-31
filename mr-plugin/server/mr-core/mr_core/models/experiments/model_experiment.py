from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from playhouse.postgres_ext import JSONField
from .experiment_provider import ExperimentProvider


class ModelExperiment(ReadWriteModel):
    """
    Associates actions with specific models in your registry
    """
    asset_id = CharField(null=False)  # UUID of the asset
    provider = ForeignKeyField(ExperimentProvider, backref='experiments', on_delete="CASCADE")
    experiment_id = CharField()  # Reference to the experiment in the provider
    data = JSONField(default=dict)  # Data for the experiment

    class Meta:
        indexes = (
            (('provider', 'asset_id', 'experiment_id'), True),
        )

