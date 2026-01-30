import logging

from flask import Blueprint, Response, request
from peewee import DoesNotExist

from amapy_pluggy.storage import BlobStoreURL
from amapy_pluggy.storage.storage_factory import StorageFactory
from amapy_server.configs import Configs
from amapy_server.models.project import Project
from amapy_server.models.role import Role
from amapy_server.models.user_role import UserRole
from amapy_server.utils import json_encoder
from amapy_server.views.utils import view_utils

logger = logging.getLogger(__file__)

project_view = Blueprint(name='db_project_view', import_name=__name__)


@project_view.route('', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return get_projects()
    elif request.method == "POST":
        return create_project()


def get_projects():
    """Returns a list of get_projects based on query params"""
    user = request.args.get('user')
    if not user:
        raise Exception("required param missing: user")
    project_fields = ["id", "name", "title", "description", "is_active", "staging_url", "remote_url", "status"]
    result = [record.to_dict(fields=project_fields) for record in Project.public()]
    return Response(json_encoder.to_json(result), mimetype="application/json", status=200)


@project_view.route('/<id>', methods=['GET'])
def get(id: str):
    user = request.args.get('user')
    if not user:
        raise Exception("required param missing: user")
    proj = Project.get(Project.id == id)
    project_fields = ["id", "name", "title", "description", "is_active", "staging_url", "remote_url", "status"]
    return Response(json_encoder.to_json(proj.to_dict(fields=project_fields)), mimetype="application/json", status=200)


def create_project():
    # create project
    data: dict = view_utils.data_from_request(request)
    project_name = data.get("name")
    user = data.get("user")
    if not user:
        raise Exception("missing required param: user")

    try:
        existing: Project = Project.get(Project.name == project_name)
        result = existing.to_dict()
        res_code = 200
    except DoesNotExist as e:
        logger.info("project not found, creating a new record with name:{}".format(project_name))
        created: Project = Project.create(user=user,
                                          name=project_name,
                                          credentials_server=data.get("credentials_server"),
                                          credentials_user=data.get("credentials_user"),
                                          description=data.get("description"),
                                          readme=data.get("readme"),
                                          is_active=data.get("is_active"),
                                          remote_url=data.get("remote_url"),
                                          staging_url="n/a")

        # write to bucket and set cors
        try:
            created.write_to_bucket()
            update_cors(created, data)
        except Exception as e:
            logger.error("error writing to bucket or update bucket cors: {}".format(e))
            res_code = 400
            result = {"error": "error in credential servers: {}".format(e), "project": created.to_dict()}
            created.delete_instance(user=user, permanently=True)
            return Response(json_encoder.to_json(result), mimetype="application/json", status=res_code)

        # create admin role and member role
        new_admin_role: Role = Role.create_if_not_exists_for_project(
            project_name=project_name,
            username=user,
            can_admin_project=True)
        new_member_role: Role = Role.create_if_not_exists_for_project(
            project_name=project_name,
            username=user,
            can_admin_project=False)
        # create user_role for project owner
        new_admin_user_role: UserRole = UserRole.create_by_role_id_username(
            role_id=new_admin_role.id,
            username=user)
        result = created.to_dict()
        res_code = 201  # created
    return Response(json_encoder.to_json(result), mimetype="application/json", status=res_code)


def update_cors(created: Project, data: dict):
    store_url=BlobStoreURL(url=data.get("remote_url"))
    with created.storage(server=True):
        remote_url = Configs.shared().get_storage_url() # get remote_url from the current project
        storage = StorageFactory.storage_for_url(src_url=remote_url) #check the usage of this line, it returns the AssetStorage instance
        storage.set_bucket_cors(credentials=data.get("credentials_server"),
                        bucket_name=store_url.bucket,
                        origin_url=Configs.shared().frontend_url)


@project_view.route('/<id>', methods=['PUT'])
def update_project(id: str):
    data: dict = view_utils.data_from_request(request)
    user = data.get("user")
    if not user:
        raise Exception("missing required param: user")
    try:
        existing: Project = Project.get(Project.id == id)
        for field in data:
            setattr(existing, field, data[field])
        existing.save(user=user)
        result = existing.to_dict()
        res_code = 200
    except DoesNotExist as e:
        logger.info("project not found")
        res_code = 404  # not found
        result = {}
    return Response(json_encoder.to_json(result), mimetype="application/json", status=res_code)
