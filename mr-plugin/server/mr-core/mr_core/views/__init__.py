from .admin_views import register_blueprints as admin_blue_prints
from .js_client_views import register_blueprints as js_client_blue_prints
from .auth_views import register_blueprints as auth_blue_prints


def register_blueprints(app):
    admin_blue_prints(app)
    js_client_blue_prints(app)
    auth_blue_prints(app)
