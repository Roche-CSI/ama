from .dataset import Dataset
from .deployment import Deployment
from .entity_group import EntityGroup
from .ml_model import MlModel
from .project import Project
from .tag import Tag
from .taggable_catagory import TaggableCategory
from .taggable_group import TaggableGroup
from .user import User
from .auth_provider import AuthProvider
from .asset_class import AssetClass
from .asset_detail import AssetDetail
from .actions import Action, AssetAction, ActionRun, ActionProvider
from .experiments import ExperimentProvider, ModelExperiment
from .monitoring import MonitoringProvider, MonitoringRun, MonitoringMetrics, MonitoringLog, MonitoringAlert, MonitoringThreshold
from flask import g

tables = [
    # First, tables with no foreign key dependencies
    AuthProvider,
    User,
    Project,  # Move Project earlier since AssetClass depends on it
    TaggableCategory,

    # Then tables with dependencies
    TaggableGroup,
    Tag,
    Dataset,
    Deployment,
    EntityGroup,
    MlModel,
    AssetClass,  # Move AssetClass after Project
    AssetDetail,
    ActionProvider,
    Action,
    AssetAction,
    ActionRun,
    ExperimentProvider,
    ModelExperiment,
    # monitoring
    MonitoringProvider,
    MonitoringRun,
    MonitoringMetrics,
    MonitoringLog,
    MonitoringAlert,
    MonitoringThreshold,
]


def create_tables(database=None):
    database = database or g.db
    with database:
        database.create_tables(tables, safe=True)


def delete_tables(database=None):
    database = database or g.db
    with database:
        database.drop_tables(tables)
