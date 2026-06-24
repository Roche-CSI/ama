import logging

from flask import Blueprint, Response, request

from amapy_server import models
from amapy_server.utils.json_encoder import to_json
from amapy_server.views.auth_views import auth_utils

logger = logging.getLogger(__file__)

view = Blueprint(name='project_view', import_name=__name__)


@view.route('', methods=['GET'])
def index():
    result = [project.to_dict(fields=models.Project.public_fields()) for project in models.Project.public()]
    return Response(to_json(result), mimetype="application/json", status=200)


@view.route('/token', methods=['GET'])
def get_token():
    # extract user from JWT
    auth_header = request.headers.get("Authorization")
    if not auth_header or "Bearer " not in auth_header:
        return Response(to_json({"error": "Unauthorized access"}), mimetype="application/json", status=401)

    token = auth_header.split("Bearer ")[1]
    current_user = auth_utils.get_user_from_token(token)
    if not current_user:
        return Response(to_json({"error": "Invalid token"}), mimetype="application/json", status=401)

    # get the project
    project_id = request.args.get("project_id")
    project = models.Project.get_if_exists(models.Project.id == project_id)
    if not project:
        return Response(to_json({"error": "Project not found"}), mimetype="application/json", status=404)

    # check if the user has a role for this project
    has_access = any(
        user_role.role.project_name == project.name
        for user_role in current_user.roles
    )
    if not has_access:
        return Response(to_json({"error": "User does not have access to the project"}),
                        mimetype="application/json",
                        status=403)

    return Response(to_json(project.storage_token()), mimetype="application/json", status=200)
