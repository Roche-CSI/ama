import logging
from functools import cached_property

from amapy_core.api.settings_api import SettingsAPI

logger = logging.getLogger(__name__)


class Project(object):

    @cached_property
    def _api(self) -> SettingsAPI:
        """A cached property that returns an instance of SettingsAPI.

        Returns
        -------
        SettingsAPI
            An instance of SettingsAPI for interacting with project settings.
        """
        return SettingsAPI()

    @cached_property
    def active(self) -> str:
        """Retrieves the name of the currently active project.

        Returns
        -------
        str
            The name of the active project.
        """
        return self._api.print_active_project(jsonize=True)

    def list(self) -> list:
        """Lists all projects available to the user.

        Returns
        -------
        list
            A list of all projects.
        """
        return self._api.print_all_projects(jsonize=True)

    def activate(self, project_name: str, persist=False) -> bool:
        """Activates a given project by name.

        Parameters
        ----------
        project_name : str
            The name of the project to activate.
        persist : bool, optional
            Set to True to make the activation persistent across sessions, by default False.

        Returns
        -------
        bool
            True if the project was successfully activated, False otherwise.
        """
        if persist:
            logger.warning("The settings file will be modified. This can cause issues if you have multiple "
                           "instances of AMA running on your machine or running AMA with multi-processing.")
        else:
            logger.warning("Activation is temporary and will not persist across sessions. "
                           "To make it permanent, set persist=True.")

        return self._api.set_active_project(project_name=project_name, persist=persist)
