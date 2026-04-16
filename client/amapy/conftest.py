import logging
import os
import shutil
import tempfile

import pytest

from amapy.plugins import register_plugins
from amapy_core.asset import Asset
from amapy_core.configs import Configs
from amapy_core.configs.app_settings import AppSettings
from amapy_core.objects.object_factory import ObjectFactory
from amapy_core.plugins import list_files
from amapy_core.store import Repo, AssetStore

logger = logging.getLogger(__name__)


def pytest_sessionstart(session):
    """ pytest_sessionstart hook

    This runs *before* import and collection of tests.

    This is *THE* place to do mocking of things that are global,
    such as `appdirs`.

    Do teardown in `pytest_sessionfinish()`
    """
    logger.info("Pre-Session Setup..")
    Configs.de_init()  # cleanup existing settings if any
    Configs.shared(mode=Configs.modes.UNIT_TEST)  # all tests to use test_settings only
    register_plugins()


def pytest_sessionfinish(session, exitstatus):
    """ pytest_sessionfinish hook

    This runs *after* any finalizers or other session activities.

    Performs teardown for `pytest_sessionstart()`
    """
    logger.info("\nPost-session Teardown..")
    Configs.de_init()  # cleanup
    AppSettings.shared().unset_project_environment()


@pytest.fixture(scope="session")
def project_root():
    return os.path.abspath(os.path.dirname(__file__))


@pytest.fixture(scope="session")
def asset_root():
    os.environ["ASSET_ROOT"] = os.path.realpath(tempfile.mkdtemp())  # .asset-manager
    os.environ["ASSET_HOME"] = os.environ.get("ASSET_ROOT")  # .assets
    return os.environ.get("ASSET_ROOT")


@pytest.fixture(scope="session")
def test_environment(asset_root):
    return {
        "auth": "/Users/google.json",
        "assets_home": asset_root,
        "user": {
            "id": "111a1111-1111-1111-1111-111111111111",
            "username": "test_user",
            "email": "test_user@blah.com",
            "token": None
        },
        "projects": {
            "222b2222-2222-2222-2222-222222222222": {
                "id": "222b2222-2222-2222-2222-222222222222",
                "name": "asset-project-2",
                "description": "Test project 2",
                "is_active": True,
                "staging_url": "gs://test_bucket/assets/staging",
                "remote_url": "gs://test_bucket/assets/remote",
                "can_edit": True,
                "can_read": True,
                "can_delete": False,
                "credentials_user": "test_user",
            },
            "333c3333-3333-3333-3333-333333333333": {
                "id": "333c3333-3333-3333-3333-333333333333",
                "name": "asset-project-3",
                "description": "Test project 3",
                "is_active": True,
                "staging_url": "gs://test_bucket/assets/staging",
                "remote_url": "gs://test_bucket/assets/remote",
                "can_edit": True,
                "can_read": True,
                "can_delete": False,
                "credentials_user": "test_user",
            }
        },
        "active_project": "222b2222-2222-2222-2222-222222222222"
    }


@pytest.fixture(scope="session")
def store(asset_root, test_environment):
    yield __setup_store(environment=test_environment)
    logger.info("tearing down")
    shutil.rmtree(path=asset_root)


@pytest.fixture(scope="session")
def repo(asset_root, store):
    """
    creates a temporary assets repo and makes it available
    cleans up the repo after work is done
    """
    # temp_dir = os.path.realpath(tempfile.mkdtemp())
    yield __setup_repo(store=store, dir=asset_root)

    logger.info("tearing down")
    if os.path.exists(asset_root):
        shutil.rmtree(path=asset_root)


@pytest.fixture(scope="session")
def test_data(repo):
    """
    copies test data into a temp project directory and
    makes available the added data files for testing
    """
    project_dir = os.path.abspath(os.path.dirname(__file__))
    test_data_dir = f"{project_dir}/test_data"

    # copy files to repo
    target = os.path.join(repo.fs_path, test_data_dir)
    # make dir if not exists
    os.makedirs(target, exist_ok=True)
    target = os.path.join(repo.fs_path, "test_data")
    shutil.copytree(test_data_dir, target)

    return target


@pytest.fixture(scope="session")
def asset(repo, test_data):
    files = list_files(root_dir=test_data)
    sources: dict = ObjectFactory().parse_sources(repo_dir=repo.fs_path,
                                                  targets=files)
    asset = Asset.create_new(repo=repo,
                             class_id="123a4567-89ab-cdef-0123-456789abcdef",
                             class_name="test_class")
    asset.create_and_add_objects(sources)
    return asset


def __setup_store(environment):
    # initialize store
    settings = AppSettings.shared()
    settings.data = AppSettings.validate(data=environment)
    settings.set_project_environment(project_id=settings.active_project)
    store = AssetStore.create_store()
    # copy test asset_classes into the store's asset_classes_dir
    project_dir = os.path.abspath(os.path.dirname(__file__))
    src = os.path.join(project_dir, "test_data", "asset_classes")
    dst = store.asset_classes_dir
    os.makedirs(dst, exist_ok=True)
    for item in os.listdir(src):
        shutil.copy2(os.path.join(src, item), dst)
    return store


def __setup_repo(store, dir):
    # initialize assets
    repo = Repo.create_repo(root_dir=dir)
    repo.store = store
    logger.info(f"setting up, created assets repo at:{repo}")
    # make sure it got created
    assert os.path.exists(os.path.join(str(repo), Repo.asset_dir()))
    return repo
