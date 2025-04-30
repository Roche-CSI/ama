from __future__ import annotations

import contextlib

from peewee import *
from amapy_server.models.utils.fields import JSONField

from amapy_pluggy.storage.storage_credentials import StorageCredentials
from amapy_pluggy.storage.storage_factory import StorageFactory
from amapy_pluggy.storage.transporter import Transporter
from amapy_server.configs import Configs
from amapy_utils.utils.in_memory_file import InMemoryFile
from .base.read_write import ReadWriteModel


class Project(ReadWriteModel):
    name = CharField(null=False)
    title = CharField(null=True)
    description = TextField(null=True)
    is_active = BooleanField(null=False, default=True)
    staging_url = TextField(null=False)
    remote_url = TextField(null=False)
    credentials_user = JSONField(null=True, default=dict)
    credentials_server = JSONField(null=True, default=dict)
    readme = TextField(null=True)

    class Meta:
        indexes = ((('name',), True),)

    @property
    def yaml_url(self):
        return Configs.shared().project_url(name=str(self.name))

    @property
    def yaml_fields(cls):
        raise NotImplementedError()

    def storage_token(self, server=False):
        with self.storage(server=server):
            return "to be implemented"
            # return get_aio_token(self.credentials_server)

    @contextlib.contextmanager
    def storage(self, server=True):
        # set credentials
        StorageCredentials.shared().set_credentials(self.credentials_server if server else self.credentials_user)
        Configs.shared().set_storage_urls(staging_url=str(self.staging_url), remote_url=str(self.remote_url))
        yield
        # clear credentials
        StorageCredentials.shared().set_credentials(None)
        Configs.shared().storage_credentials = None
        Configs.shared().clear_storage_urls()

    def write_to_bucket(self):
        with self.storage():
            project_data = self.to_dict()
            project_yaml = {"file": InMemoryFile(file_ext=".yaml", file_data=project_data),
                            "url": self.yaml_url}
            storage = StorageFactory.storage_for_url(src_url=self.yaml_url)
            transporter: Transporter = storage.get_transporter()
            transporter.write_to_bucket(data=[project_yaml])
            return self.yaml_url

    def to_dict(self, recurse=False, backrefs=False, fields=None):
        if fields and "storage_token" in fields:
            list(fields).remove("storage_token")
        data = super().to_dict(recurse=recurse, backrefs=backrefs, fields=fields)
        # TODO: use project credential later
        # data["storage_token"] = self.storage_token()
        return data

    @classmethod
    def public_fields(cls):
        return [
            "id",
            "name",
            "description",
            "is_active",
            "staging_url",
            "remote_url"
        ]

    @classmethod
    def create(cls, user=None, **query):
        query["owner"] = query.get("owner", user)
        return super(Project, cls).create(user, **query)
