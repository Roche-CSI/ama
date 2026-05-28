from google.cloud.storage import Client
from google.oauth2.credentials import Credentials


class GcsClient:

    @classmethod
    def from_credentials(cls, credentials: dict) -> Client:
        """Returns a client for interacting with GCS based on the credentials."""
        if credentials.get("access_token"):
            return Client(
                credentials=Credentials(token=credentials["access_token"]),
                project="none"
            )
        else:
            return Client.from_service_account_info(credentials)
