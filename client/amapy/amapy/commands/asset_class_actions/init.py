from amapy.commands import CliAction
from amapy_core.api.store_api import ClassInfoAPI


class InitAssetClass(CliAction):
    name = "init"
    help_msg = "Create a new asset-class"
    requires_repo = False

    def run(self, args):
        api = ClassInfoAPI(store=self.asset_store)
        with api.environment():
            api.create_asset_class()

    def get_options(self):
        return [
            # CliOption(dest="class_name",
            #           help_msg="enter a name for the asset-class you want to create",
            #           positional=True
            #           ),
        ]
