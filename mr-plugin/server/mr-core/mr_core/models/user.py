from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel


class User(ReadWriteModel):
    username = CharField(null=False)
    email = CharField(null=False)
    is_active = BooleanField(null=False, default=True)
    auth_info = JSONField(default={})  # info returned by google / OIDC
    token = TextField(default=None, null=True)
    is_admin = BooleanField(null=False, default=False)

    # Flask-Login integration for admin interface
    @property
    def is_authenticated(self):
        # user is authenticated for admin interface if they are rss_data_science admin
        if hasattr(self, "is_admin") and self.is_admin:
            return True
        return False

    def get_id(self):
        return self.id
