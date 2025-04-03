from amapy.commands.cli_action import CliAction
from amapy_core.api.settings_api import SettingsAPI


class ProjectInfo(CliAction):
    name = "info"
    help_msg = "prints project information"
    requires_repo = False
    requires_store = False

    def run(self, args):
        SettingsAPI().print_active_project()

    def get_options(self):
        return []
