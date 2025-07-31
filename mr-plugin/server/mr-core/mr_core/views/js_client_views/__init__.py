from flask_swagger import swagger
from flask import jsonify
from mr_core.models import Dataset, Tag, \
    Deployment, MlModel, TaggableCategory, TaggableGroup, EntityGroup, \
    Project, AssetClass, AssetDetail, ActionProvider, AssetAction, ActionRun, ExperimentProvider, ModelExperiment, \
    MonitoringProvider
from .jsclient_views import JsClientView
from .asset_proxy_view import AssetProxyView

URLS_MAP = {
    "dataset": Dataset,
    "tag": Tag,
    "mlmodel": MlModel,
    "deployment": Deployment,
    "taggablegroup": TaggableGroup,
    "taggablecatagory": TaggableCategory,
    "entitygroup": EntityGroup,
    "project": Project,
    "assetclass": AssetClass,
    "assetdetail": AssetDetail,
    "actionprovider": ActionProvider,
    "assetaction": AssetAction,
    "actionrun": ActionRun,
    "experimentprovider": ExperimentProvider,
    "modelexperiment": ModelExperiment,
    "monitoringprovider": MonitoringProvider,
}

ASSET_SERVER_URL = "http://localhost:5000"

PROXY_URLS = {
    "asset": "db/asset",
    "assetversion": "/db/asset_version",
    "search": "db/elastic",
    "documents": "documents",
    "models": "models",
    "artifacts": "artifacts",
    "datasets": "datasets",
    'file_url': '/db/file_url',
    'login': '/auth/web/login',
}


def register_blueprints(app):
    """
    Registers all of the views with their corresponding uri prefix
    """
    app.url_map.strict_slashes = False

    for url, model in URLS_MAP.items():
        app.register_blueprint(JsClientView(db=app.db, model=model).blueprint, url_prefix=f"/api/v1/{url}")

    # Register asset proxy views
    for url, resource_path in PROXY_URLS.items():
        proxy_view = AssetProxyView(
            base_url=ASSET_SERVER_URL,
            resource_path=resource_path
        )
        app.register_blueprint(
            proxy_view.blueprint,
            url_prefix=f"/api/v1/asset-server/{url}"
        )

    @app.route("/spec")
    def spec():
        return jsonify(swagger(app=app))
