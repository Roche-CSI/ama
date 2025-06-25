from minio import Minio
import logging
import os

import pytest

logger = logging.getLogger(__name__)


def pytest_sessionstart(session):
    """ pytest_sessionstart hook

    This runs *before* import and collection of tests.

    This is *THE* place to do mocking of things that are global,
    such as `appdirs`.

    Do tear down in `pytest_sessionfinish()`
    """
    logger.info("Pre-Session Setup..")


def pytest_sessionfinish(session, exitstatus):
    """ pytest_sessionfinish hook

    This runs *after* any finalizers or other session activities.

    Performs teardown for `pytest_sessionstart()`
    """
    logger.info("\nPost-session Teardown..")


class MockClient:
    def __init__(self, project=None, credentials=None):
        self.project = project
        self.credentials = credentials or {
            'endpoint': 'localhost:9000',
            'access_key': 'minioadmin',
            'secret_key': 'minioadmin',
            'secure': False
        }
        
        # Create a Minio client instance
        self.minio_client = Minio(
            self.credentials.get('endpoint'),
            access_key=self.credentials.get('access_key'),
            secret_key=self.credentials.get('secret_key'),
            secure=self.credentials.get('secure')
        )

# Pytest fixture to create a shared MockClient instance for the test module
@pytest.fixture(scope="module")
def mock_client():
    # Create and return a shared instance of MockClient
    client = MockClient()
    return client
