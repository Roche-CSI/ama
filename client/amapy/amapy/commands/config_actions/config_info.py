from amapy.commands import CliAction
from amapy_core.api.settings_api import SettingsAPI


class ConfigInfo(CliAction):
    name = "info"
    help_msg = "List configuration options for user"
    requires_repo = False
    requires_store = False
    requires_auth = False

    def run(self, args):
        SettingsAPI().print_user_configs()

    def get_options(self):
        return []
