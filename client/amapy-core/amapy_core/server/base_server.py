import json
import warnings
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
        return json.loads(res.content)

    def add_params(self, url, params: dict):
        """Adds query params to url"""
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

    def get(self, url: str):
        # Suppress only the urllib3 InsecureRequestWarning when SSL
        # verification is disabled, rather than swallowing all warnings.
        if not self.configs.ssl_verify:
            warnings.filterwarnings("ignore", category=urllib3.exceptions.InsecureRequestWarning)
        try:
            response = requests.get(url=url,
                                    headers=self.headers,
                                    verify=self.configs.ssl_verify)
            response.raise_for_status()
            self._check_response_warnings(response)
            return response
        except requests.exceptions.HTTPError as e:
            raise exceptions.IncorrectServerResponseError(msg=f"invalid server response: {e}")
        except Exception as e:
            raise exceptions.ServerNotAvailableError(msg=f"unable to reach asset-server: {e}")

    def put(self, url: str, data: dict):
        if not self.configs.ssl_verify:
            warnings.filterwarnings("ignore", category=urllib3.exceptions.InsecureRequestWarning)
        try:
            response = requests.put(url=url,
                                    data=json.dumps(data),
                                    headers=self.headers,
                                    verify=self.configs.ssl_verify)
            response.raise_for_status()
            self._check_response_warnings(response)
            return response
        except requests.exceptions.HTTPError as e:
            raise exceptions.IncorrectServerResponseError(msg=f"invalid server response: {e}")
        except Exception as e:
            raise exceptions.ServerNotAvailableError(msg=f"unable to reach asset-server: {e}")

    def post(self, url: str, data: dict):
        if not self.configs.ssl_verify:
            warnings.filterwarnings("ignore", category=urllib3.exceptions.InsecureRequestWarning)
        try:
            response = requests.post(url=url,
                                     data=json.dumps(data),
                                     headers=self.headers,
                                     verify=self.configs.ssl_verify)
            response.raise_for_status()
            self._check_response_warnings(response)
            return response
        except requests.exceptions.HTTPError as e:
            raise exceptions.IncorrectServerResponseError(msg=f"invalid server response: {e}")
        except Exception as e:
            raise exceptions.ServerNotAvailableError(msg=f"unable to reach asset-server: {e}")
