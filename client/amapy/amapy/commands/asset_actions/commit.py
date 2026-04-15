from amapy.commands import CliAction, CliOption
from amapy_core.api.repo_api import AssetAPI


class CommitMessage(CliAction):
    name = "commit"
    help_msg = "commit message for the changes"

    def run(self, args):
        if args.message:
            api = AssetAPI(self.repo).add
            with api.environment():
                api.add_commit_message(message=args.message)
        else:
            self.user_log.message("missing commit message, please use asset commit -m <message text>")

    def get_options(self) -> list[CliOption]:
        return [
            CliOption(
                dest="message",
                help_msg="commit message",
                short_name="m",
                full_name="message"
            )
        ]
