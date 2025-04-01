from amapy.commands import CliAction, CliOption
from amapy_utils.common.user_commands import UserCommands


class AliasHelp(CliAction):
    name = "help"
    help_msg = "information on alias commands"

    def run(self, args):
        msg = "alias commands:\n"
        msg += f"{UserCommands().alias_set()}\n"
        msg += f"{UserCommands().alias_remove()}\n"
        msg += f"{UserCommands().alias_info()}\n"
        self.user_log.message(msg)

    def get_options(self) -> [CliOption]:
        return []
