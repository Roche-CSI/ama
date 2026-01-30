# amapy_plugin_minio/minio_storage_mixin.py
from functools import cached_property
from typing import Union

from amapy_pluggy.storage import StorageData, StorageURL
from amapy_plugin_minio.minio_http_handler import MinioHttpHandler

class MinioStorageMixin:
    @cached_property
    def minio_handler(self):
        return MinioHttpHandler(credentials=self.credentials)

    def get_transporter(self):
        return self.minio_handler.get_transporter()

    def allows_object_add(self):
        return self.minio_handler.allows_object_add()

    def allows_proxy(self):
        return self.minio_handler.allows_proxy()

    def get_storage_url(self, url_string: str, ignore: str = None) -> StorageURL:
        return self.minio_handler.get_storage_url(url_string=url_string, ignore=ignore)

    def get_blob(self, url_string: str) -> StorageData:
        return self.minio_handler.get_blob(url_string=url_string)

    def blob_exists(self, url_string: str) -> bool:
        return self.minio_handler.blob_exists(url_string=url_string)

    def url_is_file(self, url: Union[StorageURL, str]) -> bool:
        return self.minio_handler.url_is_file(url=url)

    def list_blobs(self, url: Union[str, StorageURL], ignore: str = None) -> [StorageData]:
        return self.minio_handler.list_blobs(url=url, ignore=ignore)

    def delete_blobs(self, url_strings: [str]) -> None:
        self.minio_handler.delete_blobs(url_strings=url_strings)