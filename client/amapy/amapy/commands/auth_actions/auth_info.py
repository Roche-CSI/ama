from amapy.commands import CliAction, CliOption
from amapy_core.api.settings_api import SettingsAPI


class AuthInfo(CliAction):
    name = "info"
    help_msg = "displays information about the user"
    requires_repo = False
    requires_store = False

    def run(self, args):
        if hasattr(args, "token") and args.token:
            SettingsAPI().print_auth_token()
        else:
            SettingsAPI().print_auth()

    def get_options(self):
        return [
            CliOption(
                dest="token",
                help_msg="prints the user token",
                is_boolean=True
            )
        ]
