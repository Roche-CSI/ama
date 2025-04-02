from amapy.commands import CliAction
from amapy_core.configs.app_settings import AppSettings


class AuthRemove(CliAction):
    name = "remove"
    help_msg = "removes the auth from asset-manager"
    requires_store = False
    requires_repo = False

    def run(self, args):
        AppSettings.shared().auth = None
        self.user_log.message("removed asset-manager auth")

    def get_options(self):
        return []
