from amapy.commands import CliAction, CliOption
from amapy_core.api.repo_api import AssetAPI


class SetAlias(CliAction):
    name = "set"
    help_msg = "set an alias for the asset"

    def run(self, args):
        if not args.alias:
            self.user_log.error("missing the alias")
            return
        api = AssetAPI(self.repo).add
        with api.environment():
            api.add_alias(args.alias)

    def get_options(self) -> [CliOption]:
        return [
            CliOption(
                dest="alias",
                help_msg="an alias for the asset",
                n_args="?",
                positional=True
            )
        ]
