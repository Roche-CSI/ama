from amapy.commands import CliAction
from amapy_core.api.repo_api import AssetAPI


class RemoteInfo(CliAction):
    name = "remote"
    help_msg = "show asset remote information"

    def run(self, args):
        api = AssetAPI(self.repo).remote
        with api.environment():
            api.print_remote()

    def get_options(self):
        return []
