import json
import requests
import gzip
from flask import Blueprint, request, Response
from urllib.parse import urljoin


class AssetProxyView:
    def __init__(self, base_url, resource_path):
        self.base_url = base_url.rstrip('/')
        self.resource_path = resource_path
        self.name = f"asset-{resource_path}"
        self.blueprint = Blueprint(f"asset-{resource_path}", __name__)

        self.blueprint.route("/<id>", methods=["GET", "PUT", "DELETE"])(self.get_update_delete)
        self.blueprint.route("/", methods=["GET", "POST"])(self.list_create)
        self.blueprint.route("/search", methods=["GET"])(self.search)

    def _forward_request(self, path="", method=None, **kwargs):
        """
        Forward request to asset server with proper content handling
        """
        url = urljoin(f"{self.base_url}/{self.resource_path}/", path)

        # Forward basic headers but remove compression-related ones
        headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in ['host', 'content-length', 'content-encoding']
        }

        try:
            # Make request to upstream server
            response = requests.request(
                method=method or request.method,
                url=url,
                headers=headers,
                params=request.args,
                data=request.get_data() if request.get_data() else None,
                **kwargs
            )

            # Get the response content based on encoding
            content = response.content
            content_encoding = response.headers.get('Content-Encoding')

            # Only try to decompress if the content is actually compressed
            if content_encoding == 'gzip':
                try:
                    content = gzip.decompress(content)
                except Exception as e:
                    print(f"Decompression error: {str(e)}")
                    # If decompression fails, use the original content
                    content = response.content
                    content_encoding = None

            # Prepare response headers
            response_headers = {
                'Content-Type': response.headers.get('Content-Type', 'application/json'),
                'Content-Length': str(len(content))
            }

            # Forward the response as-is
            return Response(
                content,
                status=response.status_code,
                headers=response_headers
            )

        except Exception as e:
            print(f"Proxy error: {str(e)}")
            error_response = {
                "error": "Proxy request failed",
                "details": str(e)
            }
            return Response(
                json.dumps(error_response),
                status=502,
                mimetype='application/json'
            )

    def list_create(self):
        """Lists all records or creates new record in asset server"""
        return self._forward_request()

    def get_update_delete(self, id):
        """Get, update or delete specific record from asset server"""
        return self._forward_request(path=id)

    def search(self):
        """Forward search request to asset server"""
        return self._forward_request(path="search")