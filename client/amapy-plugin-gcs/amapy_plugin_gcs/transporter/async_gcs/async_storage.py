import io
import json
from collections.abc import Callable
from typing import Any

from aiofiles import open as file_open
from gcloud.aio.storage import Storage

API_ROOT = 'https://www.googleapis.com/storage/v1/b'


class StaticToken:
    """A minimal token wrapper for a pre-built GCP OAuth2 access token.

    ``gcloud.aio.storage.Storage`` calls ``await token.get()`` to obtain
    the bearer string. This class satisfies that interface without performing
    any additional network requests.
    """

    def __init__(self, credentials: dict) -> None:
        self._access_token = credentials.get("access_token")

    async def get(self) -> str:
        return self._access_token

    async def close(self) -> None:  # called by Storage on session teardown
        pass


class AsyncStorage(Storage):
    def __init__(self,
                 credentials: dict,
                 session=None) -> None:
        # check for access_token in the credentials
        if credentials.get("access_token"):
            super().__init__(session=session, token=StaticToken(credentials))
        else:
            super().__init__(session=session, service_file=io.StringIO(json.dumps(credentials)))

    async def download_to_filename(self,
                                   bucket: str,
                                   object_name: str,
                                   filename: str,
                                   callback: Callable,
                                   **kwargs: Any) -> None:
        async with file_open(filename, mode='wb+') as file_object:
            # TODO: evaluate hash calculation during bytes streaming
            data = await self.download(bucket, object_name, **kwargs)
            if callback:
                callback(filename, data)
            await file_object.write(data)
