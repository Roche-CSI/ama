import logging

from amapy_db.db import Database
from amapy_utils.utils.file_utils import FileUtils

logger = logging.getLogger(__name__)


class AssetStatesDB(Database):
    """Holds the state of the asset properties."""

    type = "asset-property-states"

    def set_state(self, property_name: str, state: str):
        self.update(**{property_name: state})

    def get_state(self, property_name: str) -> str:
        return self.retrieve(key=property_name)

    def remove_states(self):
        """Remove the states file."""
        FileUtils.delete_file(self.path)
