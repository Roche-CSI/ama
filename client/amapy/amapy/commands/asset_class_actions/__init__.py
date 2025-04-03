from amapy.commands import CommandGroup
from .discard import DiscardAssetClass
from .fetch import FetchAssetClass
from .info import AssetClassInfo
from .init import InitAssetClass
from .list import ListAssetClass
from .rename import RenameAssetClass
from .upload import UploadAssetClass


def get_actions():
    return [
        InitAssetClass(),
        ListAssetClass(),
        RenameAssetClass(),
        DiscardAssetClass(),
        UploadAssetClass(),
        FetchAssetClass(),
        AssetClassInfo()
    ]


def get_action_group():
    group = CommandGroup(name="class",
                         help="commands that applies to asset-class",
                         description="commands that applies to asset-class",
                         actions=get_actions()
                         )
    group.requires_repo = False

    return group
