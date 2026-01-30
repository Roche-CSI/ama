from amapy_pluggy.plugin.plugin_manager import PluginManager

from amapy_plugin_gcs import GcsStoragePlugin
from amapy_plugin_s3 import AwsStoragePlugin
from amapy_plugin_minio import MinioStoragePlugin


BUNDLED_PLUGINS = [
    GcsStoragePlugin,
    AwsStoragePlugin,
    MinioStoragePlugin
]


def register_plugins():
    plm = PluginManager.shared()
    for plugin_klass in BUNDLED_PLUGINS:
        plm.register(plugin=plugin_klass())
