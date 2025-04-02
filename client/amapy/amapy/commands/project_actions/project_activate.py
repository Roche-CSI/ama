from amapy.commands import CliAction, CliOption
from amapy_core.api.settings_api import SettingsAPI
from amapy_utils.utils.log_utils import LogColors


class ProjectActivate(CliAction):
    name = "activate"
    help_msg = "Set active project"
    requires_repo = False
    requires_store = False

    def run(self, args):
        if not args.target:
            self.user_log.message("project name is required", LogColors.INFO)
            return
        SettingsAPI().set_active_project(project_name=args.target)

    def get_options(self):
        return [
            CliOption(
                dest="target",
                help_msg="project name",
                positional=True
            )
        ]
