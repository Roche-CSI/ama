import pluggy
from amapy_utils.common.singleton import Singleton

from amapy_pluggy.plugin import APP_NAME


class PluginManager(Singleton):

    def post_init(self):
        from amapy_pluggy.plugin import specs as plugin_specs

        self._manager = pluggy.PluginManager(APP_NAME)
        for plugin in plugin_specs.__all__:
            self._manager.add_hookspecs(plugin)
        self._manager.load_setuptools_entrypoints(APP_NAME)

    @property
    def hook(self):
        return self._manager.hook

    def register(self, plugin):
        self._manager.register(plugin)
