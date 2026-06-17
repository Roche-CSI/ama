import json
import os

from amapy_core.configs import Configs, AppSettings
from amapy_core.server.base_server import BaseServer
from amapy_utils.common import exceptions


class AssetServer(BaseServer):

    def __init__(self):
        self.configs = Configs.shared().server

    @property
    def headers(self) -> dict:
        bearer_token = AppSettings.shared().user.get("token")
        return {
            "Authorization": f"Bearer {bearer_token}",
        }

    def _asset_route(self, id=None):
        base = os.path.join(self.url, self.configs.asset_route)
        return os.path.join(base, id) if id else base

    def _asset_class_route(self, id=None):
        base = os.path.join(self.url, self.configs.asset_class_route)
        if not base.endswith("/"):
            base += "/"
        return os.path.join(base, id) if id else f"{base}"

    def _asset_commit_route(self, id=None):
        base = os.path.join(self.url, self.configs.asset_commit_route)
        return os.path.join(base, id) if id else base

    def _asset_version_route(self, id=None):
        base = os.path.join(self.url, self.configs.asset_version_route)
        return os.path.join(base, id) if id else base

    def _find_version_route(self):
        return os.path.join(self.url, self.configs.find_version_route)

    def _asset_ref_route(self):
        return os.path.join(self.url, self.configs.asset_ref_route)

    def _find_ref_route(self):
        return os.path.join(self.url, self.configs.find_ref_route)

    def _project_token_route(self):
        return os.path.join(self.url, self.configs.project_token_route)

    def create_asset(self, **kwargs):
        return self.parse(self.post(url=self._asset_route(), data=kwargs))

    def find_asset(self, **kwargs):
        url = self.add_params(self._asset_route(), {**kwargs, "name": True})
        return self.parse(self.get(url=url))

    def create_asset_class(self, **kwargs) -> dict:
        return self.parse(self.post(url=self._asset_class_route(), data=kwargs))

    def update_asset(self, id, data: dict):
        return self.parse(self.put(url=self._asset_route(id), data=data))

    def update_refs(self, data: dict):
        return self.parse(self.post(url=self._asset_ref_route(), data=data))

    def find_refs(self, asset_name: str, project_id: str):
        url = self.add_params(url=self._asset_ref_route(),
                              params={"asset_name": asset_name,
                                      "project_id": project_id})
        return self.parse(self.get(url=url))

    def commit_asset(self, id, data: dict, message=None):
        res = self.put(url=self._asset_commit_route(id),
                       data={"payload": data,
                             "message": message})
        return self.parse(res=res), res.status_code

    def get_asset_yaml(self, id):
        return self.parse(self.get(url=self._asset_commit_route(id)))

    def get_asset(self, id):
        return self.parse(self.get(url=self._asset_route(id)))

    def find_asset_versions(self, project_id: str,
                            version_names: list = None,
                            class_name: str = None,
                            commit_hash: str = None):
        if not project_id:
            raise exceptions.NoActiveProjectError()

        data = {"project_id": project_id}
        if version_names:
            data["version_names"] = version_names
        if class_name:
            data["class_name"] = class_name
        if commit_hash:
            data["commit_hash"] = commit_hash
            data["name"] = True
        if not version_names and not commit_hash:
            raise exceptions.InvalidArgumentError("missing required parameter: hash")

        url = self.add_params(self._asset_version_route(), data)
        return self.parse(self.get(url=url))

    def get_version(self, project_id, class_id, seq_id, version_number=None):
        """Retrieves the specific version object from the server."""
        url = self.add_params(url=self._asset_version_route(),
                              params={"project_id": project_id,
                                      "class_id": class_id,
                                      "seq_id": seq_id,
                                      "version_number": version_number,
                                      "leaf_version": not version_number})
        data = self.parse(self.get(url=url))
        # server might return a list since it's hitting a common end point
        return data[0] if isinstance(data, list) else data

    def update_asset_class(self, id, data: dict):
        self.parse(self.put(url=self._asset_class_route(id), data=data))

    def get_project_token(self, project_id: str):
        """Retrieves the project token from the server."""
        url = self.add_params(self._project_token_route(), {"project_id": project_id})
        return self.parse(self.get(url=url))

    def parse(self, res):
        try:
            return json.loads(res.content)
        except json.decoder.JSONDecodeError as e:
            raise exceptions.IncorrectServerResponseError(
                msg=f"unable to parse server response: {res.content}") from e
