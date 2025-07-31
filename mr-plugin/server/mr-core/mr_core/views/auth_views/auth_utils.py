import os
import json
import datetime

from werkzeug.exceptions import abort
from flask.globals import request, current_app
from flask import current_app, Response
import jwt
import requests
from google_auth_oauthlib.flow import Flow
import google
from google.oauth2 import id_token

from mr_core import models

algorithm = "HS256"  # os.getenv("ALGORITHM")

# Add this at the top of your file
# WARNING: Only set this in development/testing
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


def user_signup(data: dict):
    if not data.get("username") or not data.get("email"):
        raise Exception("both email and username is required")
    # create user table entry
    if "roche.com" not in data.get("email"):
        raise Exception("invalid email, only valid roche emails are allowed")
    with current_app.db.atomic() as txn:
        user = models.User.get_if_exists(models.User.username == data.get("username"))
        if not user:
            user = models.User.create(user=data.get("username"), username=data.get("username"), email=data.get("email"))
        if user.email != data.get("email"):
            raise Exception("user data corruption, both email and username are unique keys")
        # check for default project in settings
        default_project = models.AssetSettings.default_project()
        if default_project:
            role = models.Role.create_if_not_exists_for_project(username=user.username, project_name=default_project.name)
            user_role = models.UserRole.create_if_not_exists_for_role(username=user.username, role_id=role.id, user_id=user.id)
        return user.to_dict()


def verify_oauth2_token(token: str, client_id: str):
    request_session = requests.session()
    token_request = google.auth.transport.requests.Request(session=request_session)
    id_info = id_token.verify_oauth2_token(
        id_token=token,
        request=token_request,
        audience=client_id
    )
    return id_info


def get_flow(configs: dict, callback_url: str):
    flow = Flow.from_client_config(client_config=configs,
                                   scopes=configs.get("web").get("scopes"),
                                   # scopes=[
                                   #     "https://www.googleapis.com/auth/userinfo.profile",
                                   #     "https://www.googleapis.com/auth/userinfo.email",
                                   #     "openid",
                                   # ],
                                   redirect_uri=callback_url,
                                   )
    return flow


# wrapper
def login_required(function):
    def wrapper(*args, **kwargs):
        encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]
        if encoded_jwt == None:
            return abort(401)
        else:
            return function()

    return wrapper


def generate_jwt(payload):
    encoded_jwt = jwt.encode(payload, current_app.secret_key, algorithm=algorithm)
    return encoded_jwt


def generate_token_with_expiry(user: dict, expiry: datetime):
    current_user = models.user.User.get_if_exists(models.user.User.email == user.get("email"))
    if user:
        login_info = {
            "user": {
                "id": str(current_user.id),
                "username": str(current_user.username),
                "email": str(current_user.email)
            },
            "exp": expiry,
        }
        jwt_token = generate_jwt(login_info)
        current_user.token = jwt_token
        current_user.save(user=current_user.username)
        return jwt_token


def validate_and_refresh_jwt(token: str):
    try:
        decoded = jwt.decode(token, current_app.secret_key, algorithms=algorithm)
        user: dict = decoded.get('user')
        current_user = models.user.User.get_if_exists(models.user.User.email == user.get("email"))
        if not current_user:
            return Response(
                response=json.dumps({"message": "User does not exist"}),
                status=500,
                mimetype='application/json'
            )
        expiry = decoded.get("exp")
    except jwt.ExpiredSignatureError:
        # Signature has expired
        days = 30  # months = 6, if not refreshed, obtain new token
        expiry = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=days)
        decoded = jwt.decode(token,
                             current_app.secret_key,
                             algorithms=algorithm,
                             options={"verify_exp": False})
        token = generate_token_with_expiry(decoded.get("user"), expiry=expiry)
    result = {"token": token, "expired": False, "expiry_date": expiry, "user": decoded.get("user")}
    return Response(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )


def validate_user_data(data: dict):
    """
    Checks the data returned by google auth
    :param data:
    :return:
    """
    if "roche.com" not in data.get('hd'):
        return False
    if not data.get('email_verified', False):
        return False
    return True


def home_page_user():
    encoded_jwt = request.headers.get("Authorization").split("Bearer ")[1]
    try:
        decoded_jwt = jwt.decode(encoded_jwt, current_app.secret_key, algorithms=[algorithm, ])
        print(decoded_jwt)
    except Exception as e:
        return Response(
            response=json.dumps({"message": "Decoding JWT Failed", "exception": e.args}),
            status=500,
            mimetype='application/json'
        )
    return Response(
        response=json.dumps(decoded_jwt),
        status=200,
        mimetype='application/json'
    )