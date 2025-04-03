from amapy.commands import CliAction, CliOption
from amapy_core.api.repo_api import AssetAPI


class RemoveAlias(CliAction):
    name = "remove"
    help_msg = "remove alias from asset"

    def run(self, args):
        api = AssetAPI(self.repo).remove
        with api.environment():
            api.remove_alias()

    def get_options(self) -> [CliOption]:
        return []
