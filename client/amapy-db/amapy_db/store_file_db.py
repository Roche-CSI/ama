import os

from amapy_db.db import Database


class StoreFileDB(Database):
    """Stats db that holds file information to manage

    Important: Stats db is a global db across the entire repo for all assets
    whereas other dbs are asset specific
    """

    type = "store-file-stats"

    def add_stats(self, **kwargs):
        """Adds to existing list of stats"""
        self.update(**{"stats": kwargs})

    def get_stats(self) -> dict:
        """Returns assets and their md5 hashes"""
        return self.retrieve("stats") or {}

    def remove_stats(self, ids: list):
        """Deletes specific assets from the list

        Parameters
        ----------
        ids : list
            url ids of asset objects
        """
        data = self.data()
        stats = data.get("stats", {})
        for id in ids:
            deleted = stats.pop(id, None)
            if deleted:
                pass
            else:
                self.user_log.alert(f"object not added yet, ignoring remove for:{id}")

        data["stats"] = stats
        self._write_to_file(data=data)

    def data(self):
        if not os.path.exists(self.path):
            # nothing stored yet
            return {"stats": {}}
        return self._read_from_file()
