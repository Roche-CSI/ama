from google.cloud.storage import Client
from google.oauth2.credentials import Credentials as OAuthCredentials


class GcsClient:

    def __new__(cls, credentials: dict):
        if credentials.get("access_token"):
            # Use OAuth2 token-based credentials
            google_creds = OAuthCredentials(token=credentials["access_token"])
            return Client(credentials=google_creds)
        else:
            # Use service account credentials
            return Client.from_service_account_info(credentials)
