class GcsToken:
    """A minimal token wrapper for a pre-built GCP OAuth2 access token.

    'gcloud.aio.storage.Storage' calls 'await token.get()' to obtain
    the bearer string. This class satisfies that interface without performing
    any additional network requests.
    """

    def __init__(self, credentials: dict) -> None:
        self._access_token = credentials.get("access_token")

    async def get(self) -> str:
        return self._access_token

    async def close(self) -> None:
        # called by Storage on session teardown
        pass
