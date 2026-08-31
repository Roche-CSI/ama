from amapy.commands.alias_actions import get_action_group as alias_group
from amapy.commands.asset_actions import get_actions as asset_actions
from amapy.commands.asset_class_actions import get_action_group as class_group
from amapy.commands.auth_actions import get_action_group as auth_group
from amapy.commands.config_actions import get_action_group as configs_group
from amapy.commands.package_actions import get_action_group as package_group
from amapy.commands.parser import CommandParser
from amapy.commands.project_actions import get_action_group as projects_group
from amapy.commands.refs_actions import get_action_group as refs_group
from amapy.commands.store_actions import get_action_group as home_group
from amapy_core.configs import configs
from amapy_utils.utils.utils import get_package_version


def get_parser(mode: configs.ConfigModes = configs.DEFAULT_MODE) -> CommandParser:
    """Build and return the command-line argument parser."""
    configs.Configs.shared(mode=mode)
    parser = CommandParser()
    parser.add_version(f"amapy {get_package_version('amapy')}")
    parser.add_actions(*asset_actions())
    parser.add_action_groups(
        class_group(),
        auth_group(),
        home_group(),
        refs_group(),
        projects_group(),
        alias_group(),
        package_group(),
        configs_group()
    )
    return parser
