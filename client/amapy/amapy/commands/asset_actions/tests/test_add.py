from amapy.commands.asset_actions.add import AddToAsset
from amapy.commands.parser import CommandParser


def test_asset_actions():
    parser = CommandParser()
    parser.add_actions(
        AddToAsset()
    )

    args, unknown = parser.parse_args(["add", "myfile.txt", "--proxy"])
    assert args.group == "add" and args.target == ["myfile.txt"]
    assert args.proxy
    assert not args.dest_dir

    args, unknown = parser.parse_args(["add", "myfile.txt", "--proxy", "--dir", "new_dir"])
    assert args.group == "add" and args.target == ["myfile.txt"]
    assert args.proxy
    assert args.dest_dir and args.dest_dir == "new_dir"
