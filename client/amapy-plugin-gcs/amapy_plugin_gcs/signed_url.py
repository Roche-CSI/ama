"""Used only in asset-server"""
import binascii
import datetime
import hashlib
import sys
from urllib.parse import quote

from google.oauth2 import service_account


def generate_signed_url(bucket_name,
                        object_name,
                        service_account_file=None,
                        service_account_json=None,
                        subresource=None,
                        expiration=604800,
                        http_method='GET',
                        query_parameters=None,
                        headers=None):
    if expiration > 604800:
        print('Expiration Time can\'t be longer than 604800 seconds (7 days).')
        sys.exit(1)

    escaped_object_name = quote(object_name.encode('utf-8') if isinstance(object_name, str) else object_name,
                                safe=b'/~')
    canonical_uri = f'/{escaped_object_name}'

    datetime_now = datetime.datetime.now(tz=datetime.UTC)
    request_timestamp = datetime_now.strftime('%Y%m%dT%H%M%SZ')
    datestamp = datetime_now.strftime('%Y%m%d')

    if service_account_file:
        google_credentials = service_account.Credentials.from_service_account_file(
            service_account_file)
    else:
        google_credentials = service_account.Credentials.from_service_account_info(
            service_account_json)

    client_email = google_credentials.service_account_email
    credential_scope = f'{datestamp}/auto/storage/goog4_request'
    credential = f'{client_email}/{credential_scope}'

    if headers is None:
        headers = dict()
    host = f'{bucket_name}.storage.googleapis.com'
    headers['host'] = host

    canonical_headers = ''
    ordered_headers = dict(sorted(headers.items()))
    for k, v in ordered_headers.items():
        lower_k = str(k).lower()
        strip_v = str(v).lower()
        canonical_headers += f'{lower_k}:{strip_v}\n'

    signed_headers = ''
    for k, _ in ordered_headers.items():
        lower_k = str(k).lower()
        signed_headers += f'{lower_k};'
    signed_headers = signed_headers[:-1]  # remove trailing ';'

    if query_parameters is None:
        query_parameters = dict()
    query_parameters['X-Goog-Algorithm'] = 'GOOG4-RSA-SHA256'
    query_parameters['X-Goog-Credential'] = credential
    query_parameters['X-Goog-Date'] = request_timestamp
    query_parameters['X-Goog-Expires'] = expiration
    query_parameters['X-Goog-SignedHeaders'] = signed_headers
    if subresource:
        query_parameters[subresource] = ''

    canonical_query_string = ''
    ordered_query_parameters = dict(sorted(query_parameters.items()))
    for k, v in ordered_query_parameters.items():
        encoded_k = quote(str(k), safe='')
        encoded_v = quote(str(v), safe='')
        canonical_query_string += f'{encoded_k}={encoded_v}&'
    canonical_query_string = canonical_query_string[:-1]  # remove trailing '&'

    canonical_request = '\n'.join([http_method,
                                   canonical_uri,
                                   canonical_query_string,
                                   canonical_headers,
                                   signed_headers,
                                   'UNSIGNED-PAYLOAD'])

    canonical_request_hash = hashlib.sha256(
        canonical_request.encode()).hexdigest()

    string_to_sign = '\n'.join(['GOOG4-RSA-SHA256',
                                request_timestamp,
                                credential_scope,
                                canonical_request_hash])

    # signer.sign() signs using RSA-SHA256 with PKCS1v15 padding
    signature = binascii.hexlify(
        google_credentials.signer.sign(string_to_sign)
    ).decode()

    scheme_and_host = f'https://{host}'
    signed_url = f'{scheme_and_host}{canonical_uri}?{canonical_query_string}&x-goog-signature={signature}'

    return signed_url
