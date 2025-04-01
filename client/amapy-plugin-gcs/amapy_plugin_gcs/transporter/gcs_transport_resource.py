import os.path

from cached_property import cached_property

from amapy_pluggy.storage import BlobStoreURL
from amapy_pluggy.storage.transporter import TransportResource
from amapy_utils.common import exceptions
from amapy_utils.utils.file_utils import FileUtils


class GcsTransportResource(TransportResource):
    @classmethod
    def from_transport_resource(cls, res: TransportResource):
        return cls(src=res.src, dst=res.dst, callback=res.callback)


class GcsUploadResource(GcsTransportResource):
    @cached_property
    def dst_url(self):
        return BlobStoreURL(url=self.dst)


class GcsDownloadResource(GcsTransportResource):
    @cached_property
    def src_url(self):
        return BlobStoreURL(url=self.src)

    def on_transfer_complete(self, *args):
        # first, make sure the file is downloaded
        if not os.path.exists(self.dst):
            raise exceptions.ResourceDownloadError(f"failed to downloaded: {self.src}")

        # then, compute the hash of the downloaded file
        if self.src_hash:
            self.dst_hash = FileUtils.bytes_hash(file_bytes=args[-1], hash_type=self.src_hash[0])
        super().on_transfer_complete(*args[:-1])


class GcsCopyResource(GcsTransportResource):
    @cached_property
    def src_url(self):
        return BlobStoreURL(url=self.src)

    @cached_property
    def dst_url(self):
        return BlobStoreURL(url=self.dst)
