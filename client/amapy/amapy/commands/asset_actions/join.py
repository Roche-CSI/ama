from amapy.commands import CliAction, CliOption
from amapy_core.api.settings_api import SettingsAPI
from amapy_utils.common.user_commands import UserCommands


class AssetJoin(CliAction):
    name = "join"
    help_msg = "Set the server url"
    requires_repo = False
    requires_store = False
    requires_auth = False

    def run(self, args):
        if not args.server_url:
            self.user_log.alert("missing required parameter server_url")
            self.user_log.message(UserCommands().clone_asset())
            return

        SettingsAPI().set_user_configs({"server_url": args.server_url})

    def get_options(self):
        return [
            CliOption(
                dest="server_url",
                help_msg="the AMA server url to connect to",
                positional=True,
                n_args="?",
            ),
        ]
