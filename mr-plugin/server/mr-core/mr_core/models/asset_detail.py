from __future__ import annotations
from peewee import *
import uuid
from .asset_class import AssetClass
from .base.read_write import ReadWriteModel

"""
keeping a copy of the model here because we need it for Actions, Monitoring and other tables
"""


class AssetDetail(ReadWriteModel):
    id = UUIDField(primary_key=True, default=None, null=False)  # id is same as asset id
    card = TextField(null=True)
