from __future__ import annotations

import enum
import os

from mr_core.utils.file_utils import FileUtils
from mr_core.utils.logging import LoggingMixin

CONFIG_FILES = {
    "DEV": "dev_configs.yaml",
    "TEST": "test_configs.yaml",
    "PRODUCTION": "prod_configs.yaml",
    "USER_TEST": "user_test_configs.yaml"
}


class ConfigModes(enum.Enum):
    DEV = 1
    TEST = 2
    PRODUCTION = 3
    USER_TEST = 4
    REMOTE_DEBUG = 5  # remote debugging production

    def config_class(self):
        if self == ConfigModes.DEV:
            return DevConfigs
        elif self == ConfigModes.TEST:
            return TestConfigs
        elif self == ConfigModes.USER_TEST:
            return UserTestConfigs
        elif self == ConfigModes.REMOTE_DEBUG:
            return RemoteDebugConfigs
        else:
            return ProdConfigs


"""CHANGE TO USER_TEST / PRODUCTION WHEN deploying"""
DEFAULT_MODE = ConfigModes.DEV


class Configs(LoggingMixin):
    modes = ConfigModes

    REMOTE: dict = None
    CLIENT: dict = None
    SERVER: dict = None
    DATABASE: dict = None
    FRONTEND: dict = None
    MODE: str = None  # TEST, DEV, PRODUCTION
    _instance = None

    def __init__(self):
        raise RuntimeError('Call initialize() instead')

    @property
    def frontend_url(self):
        return self.FRONTEND["BASE_URL"]

    @property
    def host_url(self):
        return self.SERVER["BASE_URL"]

    # def bucket_name(self, staging=False):
    #     return self.REMOTE["GCP_BUCKET_ID"].get("staging" if staging else "repo")

    # def bucket_url(self, staging=False):
    #     url = self.get_storage_url(staging=staging)
    #     if not url:
    #         raise Exception("storage url can not be null")
    #     return url  # or f"gs://{self.bucket_name(staging)}"

    # def get_storage_url(self, staging=False):
    #     return os.getenv(key="staging_url" if staging else "remote_url")

    # def set_storage_urls(self, staging_url: str, remote_url: str):
    #     if not staging_url or not remote_url:
    #         raise Exception("both staging_url and remote_url are required")
    #     os.environ["staging_url"] = staging_url
    #     os.environ["remote_url"] = remote_url

    # def clear_storage_urls(self):
    #     os.environ.pop("staging_url", None)
    #     os.environ.pop("remote_url", None)

    # def gcp_contents_dir(self, staging=False):
    #     return self.REMOTE["GCP_CONTENTS_DIR"].get("staging" if staging else "repo")

    # def contents_url(self, staging=False):
    #     return os.path.join(self.bucket_url(staging), self.gcp_contents_dir(staging))

    def storage_system(self):
        return self.CLIENT["STORAGE_SYSTEM"]

    # @property
    # def storage_credentials(self) -> dict:
    #     """gcp/aws storage credentials"""
    #     try:
    #         return self._storage_credentials
    #     except AttributeError:
    #         self._storage_credentials = None
    #         return self._storage_credentials

    # @storage_credentials.setter
    # def storage_credentials(self, x: dict):
    #     self._storage_credentials = x

    # @property
    # def gcp_assets_dir(self):
    #     return self.REMOTE["GCP_ASSETS_DIR"].get("repo")

    # @property
    # def gcp_asset_classes_dir(self):
    #     return self.REMOTE["GCP_ASSET_CLASSES_DIR"].get("repo")

    # @property
    # def gcp_projects_dir(self):
    #     return self.REMOTE["GCP_PROJECTS_DIR"].get("repo")

    # @property
    # def asset_aliases_dir(self):
    #     return self.REMOTE["GCP_ASSET_ALIASES_DIR"].get("repo")

    # @property
    # def assets_url(self):
    #     return os.path.join(self.bucket_url(), self.gcp_assets_dir)

    # @property
    # def asset_classes_url(self):
    #     return os.path.join(self.bucket_url(), self.gcp_asset_classes_dir)

    # @property
    # def aliases_url(self):
    #     return os.path.join(self.bucket_url(), self.asset_aliases_dir)

    @property
    def projects_url(self):
        return os.path.join(self.bucket_url(), self.gcp_projects_dir)

    # @property
    # def class_list_url(self):
    #     return os.path.join(self.asset_classes_url, "class_list.yaml")

    # def asset_class_url(self, class_id):
    #     return os.path.join(self.asset_classes_url, f"{class_id}.yaml")

    # def project_url(self, name):
    #     return os.path.join(self.projects_url, f"{name}.yaml")

    @classmethod
    def configs_dir(cls):
        return os.path.abspath(os.path.join(os.path.dirname(__file__), "yamls"))

    @classmethod
    def config_data(cls):
        return FileUtils.read_yaml(os.path.join(cls.configs_dir(), CONFIG_FILES[cls.MODE]))

    @staticmethod
    def shared(mode=None) -> Configs:
        mode = mode or DEFAULT_MODE
        if not Configs._instance:
            Configs._instance = Configs._initialize(mode=mode)
        return Configs._instance

    @classmethod
    def _initialize(cls, mode: ConfigModes):
        config_class = mode.config_class()
        obj: Configs = config_class.__new__(config_class)
        obj.post_init(config_class.config_data())
        obj.log.info("using config class: {}".format(obj.__class__.__name__))
        return obj

    def post_init(self, data):
        """ """
        for key in data:
            setattr(self, key, data[key])

    @classmethod
    def de_init(cls):
        Configs._instance = None


"""
declare all project specific settings here
"""


class ProdConfigs(Configs):
    MODE = 'PRODUCTION'


class RemoteDebugConfigs(ProdConfigs):

    def post_init(self, data):
        super().post_init(data=data)
        self.print_ssh_tunnel_cmd()
        self.add_ssh_tunnel_configs()

    def add_ssh_tunnel_configs(self):
        """ssh tunnel configuration for remote debugging, to use in debug mode - first run the following command
        in a separate terminal.
            ssh -L 5433:<cloud_sql_ip>:5432 <user_id>@<vm_ip>
        """
        local_bind = ('localhost', 5433)
        self.DATABASE["host"] = local_bind[0]
        self.DATABASE["port"] = local_bind[1]

    def print_ssh_tunnel_cmd(self):
        local_bind = ('localhost', 5433)
        ssh_host = "xxxxx"
        print("before running the flask app, make sure to open an ssh-tunnel using the below command")
        print(f"ssh -L {local_bind[1]}:{self.DATABASE['host']}:{self.DATABASE['port']} '<user_id>@{ssh_host}")
        print(
            f"For example: ssh -L {local_bind[1]}:{self.DATABASE['host']}:{self.DATABASE['port']} '<username>@{ssh_host}")


class DevConfigs(Configs):
    MODE = 'DEV'


class UserTestConfigs(Configs):
    MODE = 'USER_TEST'


class TestConfigs(Configs):
    MODE = 'TEST'
