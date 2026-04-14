import logging
import os
import shutil
import tempfile

from amapy_core.store.repo import Repo

logger = logging.getLogger(__file__)


def test_create_repo():
    """
    initializes repo and verifies the .assets exists at the base directory of the repo
    """
    temp_dir = os.path.realpath(tempfile.mkdtemp())

    # initialize assets
    repo_dir = Repo.create_repo(root_dir=temp_dir)
    logger.info(f"created assets repo at:{repo_dir}")

    # make sure it got created
    if not os.path.exists(os.path.join(str(repo_dir), Repo.asset_dir())):
        # remove temp_dir
        shutil.rmtree(path=repo_dir)

    assert os.path.exists(os.path.join(str(repo_dir), Repo.asset_dir()))


def test_find_root():
    """test finding root of the repo, the function is supposed to traverse up in the directory tree
    until it finds a .assets dir"""
    leaf_dir_name = "./parent/child/grand_child/grand_grand_child"

    # remove symlinks, assets only recognizes realpath
    temp_dir = os.path.realpath(tempfile.mkdtemp())
    leaf_dir = os.path.abspath(os.path.join(temp_dir, leaf_dir_name))

    # initialize assets
    repo_dir = Repo.create_repo(root_dir=temp_dir)
    logger.info(f"created assets repo at:{repo_dir}")

    # create dir tree
    os.makedirs(leaf_dir, exist_ok=True)

    prev_cwd = os.getcwd()
    try:
        # change to leaf_node
        os.chdir(leaf_dir)
        logger.info(f"checking repo from:{os.getcwd()}")

        # find repo
        repo = Repo.find_root()
        logger.info(f"found repo at:{repo}")

        # make sure its pointing to the root
        assert str(repo) == temp_dir
    finally:
        os.chdir(prev_cwd)
        # delete the temp_dir after restoring cwd to avoid leaking invalid process state
        shutil.rmtree(path=temp_dir)
        logger.info(f"removed directory tree at:{temp_dir}")
