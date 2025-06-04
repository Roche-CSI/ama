import os
from typing import Type
from amapy_pluggy.plugin import hook_impl

from amapy_contents.blobstore_content import BlobStoreContent
from amapy_pluggy.plugin.object_content import ObjectContent
from amapy_pluggy.storage import StorageData, StorageURL, BlobStoreURL
from amapy_pluggy.storage.asset_storage import AssetStorage
from amapy_plugin_minio.minio_storage_mixin import MinioStorageMixin
from amapy_plugin_minio.bucket_cors import set_bucket_cors
from amapy_plugin_minio.signed_url import create_presigned_url
from amapy_utils.common import exceptions


class MinioStorage(MinioStorageMixin, AssetStorage):
    prefixes = ["minio://",]
    name = "minio"

    def get_content_class(self) -> Type[ObjectContent]:
        """Returns the BlobStoreContent class."""
        return BlobStoreContent

    def get_object_path(self, asset_root: str, blob: StorageData, parent_url: StorageURL) -> str:
        """Returns the relative path of the blob from the asset root."""
        if not blob.name.startswith(parent_url.dir_name):
            raise exceptions.InvalidObjectSourceError(f"{blob.name} is outside {parent_url.dir_name}")
        return os.path.relpath(blob.name, parent_url.dir_name)

    def signed_url_for_blob(self, blob_url: str):
        """Returns a signed URL for the given blob URL."""
        url = BlobStoreURL(url=blob_url)
        return create_presigned_url(credentials=self.credentials,
                                    bucket_name=url.bucket,
                                    object_name=url.path)

    def get_bucket_cors(self, bucket_url: str):
        """Returns the CORS configuration for the given bucket URL."""
        url = BlobStoreURL(url=bucket_url)
        return get_bucket_cors(credentials=self.credentials,
                               bucket_name=url.bucket)

    def set_bucket_cors(self, bucket_url: str, origin_url):
        """Sets the CORS configuration for the given bucket URL."""
        url = BlobStoreURL(url=bucket_url)
        return set_bucket_cors(credentials=self.credentials,
                               bucket_name=url.bucket,
                               origin_url=origin_url)


class MinioStoragePlugin:
    @hook_impl
    def asset_storage_get(self)-> Type[AssetStorage]:
        """Returns the MinioStorage class."""
        return MinioStorage
