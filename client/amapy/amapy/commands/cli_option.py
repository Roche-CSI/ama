from dataclasses import dataclass


@dataclass
class CliOption:
    dest: str
    help_msg: str
    n_args: str = "?"
    short_name: str = None
    full_name: str = None
    default: list = None
    positional: bool = False
    is_boolean: bool = False
    bool_action: str = "store_true"
    action: str = None
    version: str = None

    def __post_init__(self):
        self.default = self.default or []
        if not self.action and not self.positional and not self.is_boolean:
            if not self.short_name and not self.full_name:
                raise Exception("short_name / full_name required")

    def add_to_parser(self, parser):
        """adds itself to sub_parser"""
        if self.action:
            args = []
            if self.short_name:
                args.append(f"-{self.short_name}")
            if self.full_name:
                args.append(f"--{self.full_name}")
            kwargs = {"action": self.action, "help": self.help_msg}
            if self.version:
                kwargs["version"] = self.version
            parser.add_argument(*args, **kwargs)
        elif self.positional:
            parser.add_argument(dest=self.dest,
                                help=self.help_msg,
                                nargs=self.n_args,
                                default=self.default)
        elif self.is_boolean:
            parser.add_argument(f"--{self.dest}",
                                help=self.help_msg,
                                action=self.bool_action)
        else:
            args = []
            if self.short_name:
                args.append(f"-{self.short_name}")
            if self.full_name:
                args.append(f"--{self.full_name}")
            parser.add_argument(*args,
                                dest=self.dest,
                                help=self.help_msg,
                                nargs=self.n_args,
                                default=self.default)
