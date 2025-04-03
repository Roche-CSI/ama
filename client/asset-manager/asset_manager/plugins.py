import os

from amapy_pluggy import register_plugins as pluggy
from amapy_plugin_gcr import GcrStoragePlugin
from amapy_plugin_gcs import GcsStoragePlugin
from amapy_plugin_posix import PosixStoragePlugin
from amapy_plugin_s3 import AwsStoragePlugin

BUNDLED_PLUGINS = [
    GcsStoragePlugin,
    GcrStoragePlugin,
    AwsStoragePlugin,
    PosixStoragePlugin
]

PLUGINS_REGISTERED = False


def register_plugins(env_vars=None):
    """Register all the plugins and sets the necessary environment variables"""
    if env_vars:
        for key, value in env_vars.items():
            if value:
                os.environ[key] = value

    global PLUGINS_REGISTERED
    if not PLUGINS_REGISTERED:
        pluggy(*BUNDLED_PLUGINS)
        PLUGINS_REGISTERED = True
