import logging
import os

import pytest

from amapy_pluggy.storage.storage_credentials import StorageCredentials

logger = logging.getLogger(__name__)

MOCK_GCS_CREDENTIALS = {
    "type": "service_account",
    "project_id": "test-project",
    "private_key_id": "key-id",
    "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIhbe73bcieucjbceuebcjdjcn\n-----END RSA PRIVATE KEY-----\n",
    "client_email": "test@test-project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
}


def pytest_sessionstart(session):
    """ pytest_sessionstart hook

    This runs *before* import and collection of tests.

    This is *THE* place to do mocking of things that are global,
    such as `appdirs`.

    Do teardown in `pytest_sessionfinish()`
    """
    logger.info("Pre-Session Setup..")
    # set up mock credentials so GcsStorage and AsyncGcsTransporter
    # don't fail with "missing storage credentials"
    creds = StorageCredentials.shared()
    creds.set_credentials(MOCK_GCS_CREDENTIALS)
    creds.set_content_credentials(MOCK_GCS_CREDENTIALS)


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
def test_data():
    project_dir = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(project_dir, "test_data")


@pytest.fixture(scope="session")
def mock_bucket(test_data):
    """Path to the mock bucket"""
    return os.path.join(test_data, "mock_bucket")


@pytest.fixture(scope="session")
def mock_gcs_credentials():
    """Mock GCS service account credentials for tests"""
    return MOCK_GCS_CREDENTIALS
