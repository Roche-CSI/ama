import flask_admin
from .tag_admin import TagAdmin
from .dataset_admin import DatasetAdmin
from .deployment_admin import DeploymentAdmin
from .entity_group_admin import EntityGroupAdmin
from .taggable_catagory_admin import TaggableCategoryAdmin
from .taggable_group_admin import TaggableGroupAdmin
from .mlmodel_admin import MlModelAdmin
from .project_admin import ProjectAdmin
from .auth_provider_admin import AuthProviderAdmin
from .user_admin import UserAdmin
from .asset_class_admin import AssetClassAdmin
from .asset_detail_admin import AssetDetailAdmin
from .action_provider_admin import ActionProviderAdmin
from .action_admin import ActionAdmin
from .asset_action_admin import AssetActionAdmin
from .action_run_admin import ActionRunAdmin
from .experiment_provider_admin import ExperimentProviderAdmin
from .model_experiment_admin import ModelExperimentAdmin
from .monitoring_provider_admin import MonitoringProviderAdmin
from .monitoring_run_admin import MonitoringRunAdmin
from .monitoring_threshold_admin import MonitoringThresholdAdmin
from .monitoring_metrics_admin import MonitoringMetricsAdmin
from .monitoring_alert_admin import MonitoringAlertAdmin
from .monitoring_log_admin import MonitoringLogAdmin

views = [
    TagAdmin,
    DatasetAdmin,
    DeploymentAdmin,
    EntityGroupAdmin,
    TaggableCategoryAdmin,
    TaggableGroupAdmin,
    MlModelAdmin,
    ProjectAdmin,
    AuthProviderAdmin,
    UserAdmin,
    AssetClassAdmin,
    AssetDetailAdmin,
    ActionProviderAdmin,
    ActionAdmin,
    AssetActionAdmin,
    ActionRunAdmin,
    ExperimentProviderAdmin,
    ModelExperimentAdmin,
    MonitoringProviderAdmin,
    MonitoringRunAdmin,
    MonitoringThresholdAdmin,
    MonitoringMetricsAdmin,
    MonitoringAlertAdmin,
    MonitoringLogAdmin
]


def register_blueprints(app):
    app.config['FLASK_ADMIN_SWATCH'] = 'flatly'
    admin = flask_admin.Admin(app=app,
                              name="model registry server",
                              #   index_view=AdminIndexView(),
                              endpoint="admin",
                              template_mode='bootstrap2'
                              )
    for view in views:
        admin.add_view(view())
