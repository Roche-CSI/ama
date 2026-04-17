from unittest.mock import patch

from amapy.python_api.project import Project
from amapy_core.configs.app_settings import AppSettings


def test_list(test_environment):
    settings = AppSettings.shared()
    settings.data = AppSettings.validate(data=test_environment)
    with patch("amapy_core.api.settings_api.AppSettings.shared", return_value=settings):
        project_list = Project().list()
        assert len(project_list) == len(test_environment.get("projects"))
        expected_keys = ["name", "id", "description", "remote_url", "is_active"]
        for project in project_list:
            for key in expected_keys:
                assert key in project


def test_active_project(test_environment):
    settings = AppSettings.shared()
    settings.data = AppSettings.validate(data=test_environment)
    with patch("amapy_core.api.settings_api.AppSettings.shared", return_value=settings):
        active_project = Project().active
        assert isinstance(active_project, dict)
        expected_keys = ["name", "id", "description", "remote_url", "is_active"]
        for key in expected_keys:
            assert key in active_project
