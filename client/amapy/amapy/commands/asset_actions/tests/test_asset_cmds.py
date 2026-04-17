from amapy.commands.asset_actions.add import AddToAsset
from amapy.commands.asset_actions.clone import CloneAsset
from amapy.commands.asset_actions.download import DownloadAsset
from amapy.commands.asset_actions.fetch import FetchAsset
from amapy.commands.asset_actions.info import AssetInfo
from amapy.commands.asset_actions.init import InitAsset
from amapy.commands.asset_actions.list import ListAssets
from amapy.commands.asset_actions.remove import RemoveFromAsset
from amapy.commands.asset_actions.switch import AssetSwitch
from amapy.commands.asset_actions.upload import UploadAsset
from amapy.commands.parser import CommandParser


def test_asset_actions():
    parser = CommandParser()
    parser.add_actions(
        AddToAsset(),
        ListAssets(),
        RemoveFromAsset(),
        InitAsset(),
        AssetSwitch(),
        UploadAsset(),
        DownloadAsset(),
        FetchAsset(),
        AssetInfo(),
        CloneAsset()
    )

    args, _ = parser.parse_args(["add", "myfile.txt"])
    assert args.group == "add" and args.target == ["myfile.txt"]

    args, _ = parser.parse_args(["remove", "myfile.txt", "1.log"])
    assert args.group == "remove" and args.target == ["myfile.txt", "1.log"]

    args, _ = parser.parse_args(["init"])
    assert args.group == "init"

    args, _ = parser.parse_args(["init", "genetics"])
    assert args.group == "init" and args.class_name == "genetics"

    args, _ = parser.parse_args(["upload"])
    assert args.group == "upload" and not args.message

    args, _ = parser.parse_args(["upload", "-m", "first commit"])
    assert args.group == "upload" and args.message == "first commit"

    args, _ = parser.parse_args(["upload", "--message", "second commit"])
    assert args.group == "upload" and args.message == "second commit"

    args, _ = parser.parse_args(["download"])
    assert args.group == "download"

    args, _ = parser.parse_args(["info", "--hash"])
    assert args.group == "info"

    args, _ = parser.parse_args(["clone", "model_visualizations/1"])
    assert args.group == "clone"
