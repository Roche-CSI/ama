from flask import Flask
from flask_cors import CORS, cross_origin
from mr_core.models import create_tables
from mr_core.db import get_db
from mr_core.views import register_blueprints
from mr_core.configs import Configs

APP_SECRET = 'secret_key_for_flask_app_12345'


def create_app() -> Flask:
    """ Creates Flask app and database connection
    Returns
    -------
    app: Flask app
    database

    """
    app = Flask(__name__)

    database = get_db(app=app)
    create_tables(database=database)

    @app.before_request
    def before_request():
        database.connect(reuse_if_open=True)
        # todo: check if server_available from asset-settings
        #  reject otherwise

    @app.after_request
    def after_request(response):
        database.close()
        return response

    # @cross_origin(origins="http://model-registry.com")  # Enable CORS for this route only
    @app.route('/')
    def hello_world():
        return 'Hello World!'

    app.db = database
    register_blueprints(app)

    CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}})

    app.secret_key = APP_SECRET

    return app


def run():
    Configs.shared()  # default is DEV
    create_app().run(debug=True)


if __name__ == '__main__':
    run()