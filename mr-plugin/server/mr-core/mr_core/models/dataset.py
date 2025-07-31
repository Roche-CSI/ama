from __future__ import annotations
from peewee import *
from playhouse.postgres_ext import JSONField
from .base.read_write import ReadWriteModel
from datetime import datetime, timezone
import pytz


class Dataset(ReadWriteModel):
    id = UUIDField(primary_key=True)  # Unique identifier for the dataset
    name = CharField()  # Name of the dataset
    description = TextField(null=True)  # Optional description of the dataset
    tags = JSONField(null=True)  # Optional array of tags or keywords associated with the dataset
    license = CharField()  # License under which the dataset is provided
    owner = CharField()  # Username of the dataset owner or creator
    created_at = DateTimeField(null=False, default=lambda: datetime.now(pytz.utc))  # Timestamp when the dataset was created (ISO date string)
    modified_at = DateTimeField(null=True)  # Optional timestamp of the last update (ISO date string)
    downloads = IntegerField()  # Number of downloads for the dataset
    likes = IntegerField()  # Number of likes or upvotes for the dataset
    format = CharField()  # Format of the dataset (e.g., "CSV", "JSON", "Parquet")
    size = CharField()  # Size of the dataset (e.g., "1 GB", "500 MB")
    metadata = JSONField(null=True)  # Optional additional metadata as key-value pair
    url = CharField(null=True)  # URL where the dataset can be accessed or downloaded
    num_records = IntegerField(null=True)  # Optional number of records in the dataset
    version = CharField(null=True)  # Version of the dataset


    @classmethod
    def create(cls, user=None, **query):
        # will implement user later.
        query.setdefault('created_at', datetime.now(timezone.utc))  # Set created_at if not provided
        query.setdefault('modified_at', datetime.now(timezone.utc))  # Set modified_at if not provided  # Set modified_at if not provided
        return super(Dataset,cls).create(user, **query)