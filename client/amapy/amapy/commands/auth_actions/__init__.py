from amapy.commands.cmd_group import CommandGroup
from .auth_info import AuthInfo
from .auth_login import AuthLogin
from .auth_logout import AuthLogout
from .auth_remove import AuthRemove
from .auth_set import AuthSet
from .auth_signup import AuthSignup
from .auth_update import AuthUpdate


def get_actions():
    return [
        # AuthSet(),
        AuthInfo(),
        # AuthRemove(),
        AuthLogin(),
        AuthSignup(),
        AuthLogout(),
        AuthUpdate()
    ]


def get_action_group():
    group = CommandGroup(name="auth",
                         help="asset-manager auth commands",
                         description="asset-manager auth commands",
                         actions=get_actions(),
                         default_action=AuthInfo()
                         )
    group.requires_store = False
    group.requires_repo = False
    group.requires_auth = False
    return group
