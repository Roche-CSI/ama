from amapy.commands.cli_action import CliAction
from amapy_core.api.settings_api import SettingsAPI


class ProjectList(CliAction):
    name = "list"
    help_msg = "List all projects"
    requires_repo = False
    requires_store = False

    def run(self, args):
        SettingsAPI().print_all_projects()

    def get_options(self):
        return []
