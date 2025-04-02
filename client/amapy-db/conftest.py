import logging
import os
import tempfile

import pytest

logger = logging.getLogger(__name__)


def pytest_sessionstart(session):
    """ pytest_sessionstart hook

    This runs *before* import and collection of tests.

    Do teardown in `pytest_sessionfinish()`
    """
    logger.info("Pre-Session Setup..")


def pytest_sessionfinish(session, exitstatus):
    """ pytest_sessionfinish hook

    This runs *after* any finalizers or other session activities.

    Performs teardown for `pytest_sessionstart()`
    """
    logger.info("\nPost-session Teardown..")


@pytest.fixture(scope="session")
def project_root():
    return os.path.abspath(os.path.dirname(__file__))


@pytest.fixture(scope="session")
def asset_root():
    os.environ["ASSET_ROOT"] = os.path.realpath(tempfile.mkdtemp())  # .asset-manager
    os.environ["ASSET_HOME"] = os.environ.get("ASSET_ROOT")  # .assets
    return os.environ.get("ASSET_ROOT")
