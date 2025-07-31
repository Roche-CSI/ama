# from .tag_view import tag_view
from flask_swagger import swagger
from flask import jsonify
from .ui_auth_view import UiAuthView
from .cli_auth_view import CliAuthView

URLS_MAP = {
    "ui-auth": UiAuthView,
    # "cli-auth": CliAuthView
}


def register_blueprints(app):
    """
    Registers all of the views with their corresponding uri prefix
    """
    for url, model in URLS_MAP.items():
        app.register_blueprint(UiAuthView().blueprint, url_prefix=f"/api/v1/auth/{url}")
        # app.register_blueprint(CliAuthView().blueprint, url_prefix=f"/api/v1/auth/{url}/")

