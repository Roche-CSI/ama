from amapy.commands.cmd_group import CommandGroup
from .config_info import ConfigInfo
from .reset_configs import ResetConfigs
from .set_configs import SetConfigs


def get_actions():
    return [
        ConfigInfo(),
        SetConfigs(),
        ResetConfigs()
    ]


def get_action_group():
    group = CommandGroup(name="config",
                         help="asset-manager config commands",
                         description="asset-manager config commands",
                         actions=get_actions(),
                         default_action=ConfigInfo()
                         )
    group.requires_store = False
    group.requires_repo = False
    group.requires_auth = False
    return group
