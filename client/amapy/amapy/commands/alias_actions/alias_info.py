from amapy.commands import CliAction, CliOption
from amapy_core.api.repo_api import AssetAPI


class AliasInfo(CliAction):
    name = "info"
    help_msg = "view information on asset alias"

    def run(self, args):
        api = AssetAPI(self.repo).info
        with api.environment():
            api.list_alias()

    def get_options(self) -> [CliOption]:
        return []
