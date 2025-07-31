import json
from flask import Blueprint, Response, session, request, redirect
from .auth_utils import get_flow, generate_jwt, verify_oauth2_token, validate_user_data
from mr_core.configs import Configs
from mr_core.models.auth_provider import AuthProvider
from mr_core.models.user import User


class UiAuthView:

    def __init__(self):
        self.blueprint = Blueprint(name="json-fox-ui-auth", import_name=__name__)
        self.blueprint.route("/<id>", methods=["GET", "PUT", "DELETE"])(self.get_update_delete)
        self.blueprint.route("/", methods=["GET", "POST"])(self.list_create)
        self.blueprint.route("/login", methods=["GET"])(self.login)
        self.blueprint.route("/search", methods=["GET"])(self.search)
        self.blueprint.route("/callback", methods=["GET"])(self.callback)

    def list_create(self):
        pass

    def get_update_delete(self):
        pass

    def search(self):
        pass

    def login(self):
        auth = AuthProvider.get(AuthProvider.name == "google-auth")
        flow = get_flow(
            configs=auth.configs,
            callback_url=Configs.shared().host_url + "/api/v1/auth/ui-auth/callback"
        )
        authorization_url, state = flow.authorization_url()
        # Store the state so the callback can verify the auth server response.
        session["state"] = state
        return Response(
            response=json.dumps({'auth_url': authorization_url}),
            status=200,
            mimetype='application/json'
        )

    def callback(self):
        auth = AuthProvider.get(AuthProvider.name == "google-auth")
        flow = get_flow(
            configs=auth.configs,
            callback_url=Configs.shared().host_url + "api/v1/auth/ui-auth/callback"
        )
        client_id = auth.configs["web"]["client_id"]
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials
        id_info = verify_oauth2_token(token=credentials._id_token,
                                      client_id=client_id
                                      )
        session["google_id"] = id_info.get("sub")

        # removing the specific audience, as it is throwing error
        # insert into user table
        if validate_user_data(data=id_info):
            # check if record exists
            user = User.get_if_exists(User.email == id_info.get("email"))
            if user:
                login_info = {
                    "user": {
                        "id": str(user.id),
                        "username": str(user.username),
                        "email": str(user.email)
                    }
                }
                jwt_token = generate_jwt(login_info)
                # user.g_info = {**id_info, "jwt": jwt_token}
                user.g_info = id_info
                user.token = jwt_token
                user.save(user=user.username)
                login_info["roles"] = user.get_roles(credentials=False)
                login_info["user"]["token"] = jwt_token
                # login_info["default_project"] = str(default_project.id) if default_project else None
                login_info["redirect_url"] = "/projects"
            else:
                login_info = {
                    "error": "invalid user"
                }
        else:
            login_info = {
                "error": f"invalid email: {id_info.get('email')}"
            }

        jwt_token = generate_jwt(login_info)
        print(f"jwt:{jwt_token}")
        return redirect(f"{Configs.shared().frontend_url}?jwt={jwt_token}")
