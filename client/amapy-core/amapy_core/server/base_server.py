import json
import warnings
from typing import Literal
from urllib import parse

import requests
import urllib3

from amapy_utils.common import exceptions
from amapy_utils.utils import UserLog


class BaseServer:
    configs = None

    @property
    def url(self):
        return self.configs.server_url

    @property
    def headers(self) -> dict | None:
        """Request headers. Override in subclasses to add auth headers etc."""
        return None

    def parse(self, res):
        try:
            return json.loads(res.content)
        except json.decoder.JSONDecodeError as e:
            raise exceptions.IncorrectServerResponseError(
                msg=f"unable to parse server response: {res.content}"
            ) from e

    def add_params(self, url, params: dict):
        """Adds query params to url."""
        parsed = parse.urlparse(url)
        query = parsed.query
        url_dict = dict(parse.parse_qsl(query))
        url_dict.update(params)
        url_new_query = parse.urlencode(url_dict, True)
        parsed = parsed._replace(query=url_new_query)
        return parse.urlunparse(parsed)

    def _check_response_warnings(self, response):
        """Emit any HTTP Warning headers via UserLog.

        The Warning header may appear on any response (2xx, 3xx, etc.)
        and is independent of the HTTP status code.
        """
        warning = response.headers.get("Warning")
        if warning:
            UserLog().alert(warning)

    def _request(self,
                 method: Literal["GET", "PUT", "POST"],
                 url: str,
                 data: dict | None = None
                 ) -> requests.Response:
        # Suppress only the urllib3 InsecureRequestWarning when SSL
        # verification is disabled, rather than swallowing all warnings.
        if not self.configs.ssl_verify:
            warnings.filterwarnings(action="ignore", category=urllib3.exceptions.InsecureRequestWarning)
        try:
            response = requests.request(
                method,
                url=url,
                data=json.dumps(data) if data is not None else None,
                headers=self.headers,
                verify=self.configs.ssl_verify
            )
            response.raise_for_status()
            self._check_response_warnings(response)
            return response
        except requests.exceptions.HTTPError as e:
            raise exceptions.IncorrectServerResponseError(msg=f"invalid server response: {e}")
        except Exception as e:
            raise exceptions.ServerNotAvailableError(msg=f"unable to reach asset-server: {e}")

    def get(self, url: str):
        return self._request("GET", url)

    def put(self, url: str, data: dict):
        return self._request("PUT", url, data)

    def post(self, url: str, data: dict):
        return self._request("POST", url, data)
