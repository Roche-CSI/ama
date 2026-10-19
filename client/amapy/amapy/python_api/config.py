import logging
from functools import cached_property
from typing import Any

from amapy_core.api.settings_api import SettingsAPI

logger = logging.getLogger(__name__)


class Config(object):

    @cached_property
    def _api(self) -> SettingsAPI:
        """Instance of SettingsAPI."""
        return SettingsAPI()

    def info(self) -> dict:
        """Retrieves information about the current configuration.

        Returns
        -------
        dict
            A dictionary containing configuration options for the user.
        """
        return self._api.print_user_configs(jsonize=True)

    def set(self, key: str, value: Any, persist: bool = True):
        """Sets custom configuration options.

        Parameters
        ----------
        key : str
            The key for the configuration option.
        value : Any
            The value for the configuration option.
        persist : bool, optional
            Setting it to False will just update the data without modifying the file.
        """
        if persist:
            logger.warning("The settings file will be modified. This can cause issues if you have multiple "
                           "instances of AMA running on your machine or running AMA with multi-processing. "
                           "To just update the data, set persist=False.")
        else:
            logger.warning("Update is temporary and will not persist across sessions. "
                           "To make it permanent, set persist=True.")

        return self._api.set_user_configs({key: value}, persist=persist)

    def reset(self, *keys):
        """Resets the configuration to the default value.

        Parameters
        ----------
        keys : str
            The keys to reset.
        """
        return self._api.reset_user_configs(keys=keys)
