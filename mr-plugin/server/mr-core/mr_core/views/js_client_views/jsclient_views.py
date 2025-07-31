import json
import urllib.parse
from typing import Type
import uuid
import logging
from peewee import *
from typing import Dict, Any, Type
from operator import and_
from functools import reduce
import operator

from flask import Blueprint, request, Response, jsonify
from mr_core.utils.json_encoder import to_json
from peewee import DoesNotExist
from mr_core.models.base.base import BaseModel
from mr_core.models import TaggableGroup, TaggableCategory, Tag, EntityGroup 
logger = logging.getLogger(__name__)


class JsClientView:
    blueprint = None
    model = None

    def __init__(self, db, model: Type[BaseModel]):
        self.model = model
        self.model.db = db
        self.name = model.__name__.lower()
        self.blueprint = Blueprint(f"josn-{self.model.__name__.lower()}", __name__)
        self.blueprint.route("/<id>", methods=["GET", "PUT", "DELETE"])(self.get_update_delete)
        self.blueprint.route("/<entity_group_name>/<group_name>/",  methods=['GET'])(self.get_by_group)
        self.blueprint.route("/", methods=["GET", "POST"])(self.list_create)
        self.blueprint.route("/search", methods=["GET"])(self.search)
    

    def list_create(self):
        """lists all records in the ENTITY collection"""
        if request.method == "GET":
            query = self.parse_request()
            print(f"query: {json.dumps(query)}")
            recursive = query.pop("recursive", False)
            if query and isinstance(query, dict):
                base_query = self.model.select()
                # Apply filters if query exists
                if query and isinstance(query, dict):
                    base_query = self.apply_query_filters(base_query, query)
                result = [obj.to_dict(recurse=recursive) for obj in base_query]
            else:
                result = [obj.to_dict(recurse=recursive) for obj in self.model.select()]
            print(f"query: {json.dumps(query)}, found {len(result)} records")
            return Response(
                json.dumps(result, default=str),
                mimetype="application/json",
                status=200,
            )
        elif request.method == "POST":
            try:
                data: dict = json.loads(request.data.decode("utf-8"))
                if 'id' in data and data.get("id"):
                    existing_record = self.model.get_or_none(self.model.id == data['id'])
                    if existing_record:
                        return Response(
                            json.dumps({"error": "Duplicate ID: A record with this ID already exists."}, default=str),
                            status=409  # Conflict
                        )
                if not isinstance(data, dict):
                    return Response(json.dumps({"error": "Invalid JSON data, must be a dictionary"}, default=str),
                                    status=400)
                # with self.model.db.atomic():
                record = self.model.create(**data)

                serialized = record.to_dict(recurse=True)
                return Response(
                    to_json(serialized), mimetype="application/json", status=201)
            except Exception as e:
                return Response(json.dumps({"error": str(e)}, default=str), status=400)

    def get_update_delete(self, id):
        try:
            # Fetch the record by ID
            record = self.model.get(self.model.id == id)
            
            # Handle GET request
            if request.method == "GET":
                return jsonify(record.__data__), 200  # Use `__data__` to get all fields as a dictionary

            # Handle PUT request
            elif request.method == "PUT":
                updated_data = request.get_json()
                for key, value in updated_data.items():
                    if hasattr(record, key):  # Ensure only valid attributes are updated
                        setattr(record, key, value)
                record.save()
                return jsonify({"message": "Data updated successfully"}), 200

            # Handle DELETE request
            elif request.method == "DELETE":
                record.delete_instance(permanently=True)
                return jsonify({"message": "Data deleted successfully"}), 200
        except DoesNotExist:
            return jsonify({"error": "Data not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def search(self):
        query: str = request.args.get("query", None)
        if not query:
            return Response(json.dumps({"error": "Query is required"}, default=str), status=400)

        page: int = int(request.args.get("page", None)) if request.args.get("page", None) else 1
        limit: int = int(request.args.get("limit", None)) if request.args.get("limit", None) else 10
        try:
            query = urllib.parse.unquote(query)
            query = query.replace("'", '"')  # Step 2: Replace single quotes with double quotes
            query = json.loads(query)
            result = self.model.query(query=query, page=page, limit=limit)
            result["items"] = [item.to_dict() for item in result["items"]] if result else []
            return Response(json.dumps(result), mimetype="application/json",
                            status=200)
        except json.JSONDecodeError as e:
            return jsonify({'error': 'Invalid JSON data', 'message': str(e)}), 400

    def parse_request(self):
        query = request.args.to_dict()
        for key, val in query.items():
            if val.lower() == "true":
                query[key] = True
            elif val.lower() == "false":
                query[key] = False
        return query
    

    # def inherit(self):
    #     try:
    #         data: dict = json.loads(request.data.decode("ascii"))
    #         if not isinstance(data, dict):
    #             return Response(json.dumps({"error": "Invalid JSON data, must be a dictionary"}, default=str),
    #                             status=400)
    #         with self.model.atomic():
    #             temp = self.model.create(exists_ok=True, **data)
    #             tag, created = temp
    #             serialized = tag.to_dict(recursive=True)
    #             return Response(
    #                 json.dumps(serialized), mimetype="application/json", status=201 if created else 200)
    #     except Exception as e:
    #         return Response(json.dumps({"error": str(e)}, default=str), status=400)

    
    def get_by_group(self,entity_group_name, group_name):
        """
        Fetch tags grouped by entity_group_name and group_name.

        Args:
            entity_group_name (str): Entity group name (e.g., 'Models', 'Datasets').
            group_name (str): Specific group name (e.g., 'tasks', 'datasets').

        Returns:
            JSON response with nested data structure.
        """
        try:
            # Step 1: Fetch the `EntityGroup` based on the name
            entity_group = EntityGroup.get(EntityGroup.name == entity_group_name)

            # Step 2: Fetch the `TaggableGroup` for the given `entity_group_name` and `group_name`
            taggable_group = TaggableGroup.get(
                (TaggableGroup.entity_group_id == entity_group.id) &
                (TaggableGroup.name == group_name)
            )

            # Step 3: Fetch all `TaggableCategory` entries related to this group
            categories = TaggableCategory.select().where(TaggableCategory.group_id == taggable_group.id)

            # Step 4: Fetch all `Tags` under these categories
            tags = Tag.select().where(Tag.category << categories)

            # Step 5: Structure the response
            response = {
                "id": str(taggable_group.id),
                "name": taggable_group.name,
                "entity_group_id": str(taggable_group.entity_group_id.id),
                "entity_group_name": taggable_group.entity_group_name,
                "description": taggable_group.description,
                "created_by": taggable_group.created_by,
                # "created_at": taggable_group.created_at.isoformat(),
                # "modified_at": taggable_group.modified_at.isoformat(),
                "categories": [
                    {
                        "id": str(category.id),
                        "name": category.name,
                        "group_name": category.group_name,
                        "description": category.description,
                        "created_by": category.created_by,
                        # "created_at": category.created_at.isoformat(),
                        # "modified_at": category.modified_at.isoformat(),
                        "readme_md": category.readme_md,
                        "tags": [
                            {
                                "id": str(tag.id),
                                "name": tag.name
                            }
                            for tag in tags if tag.category.id == category.id
                        ]
                    }
                    for category in categories
                ]
            }

            # Return the structured response
            return jsonify(response), 200

            # return jsonify({"success": True, "group": response}), 200

        except DoesNotExist as e:
            return jsonify({"success": False, "message": "Entity group or group not found", "details": str(e)}), 404

        except Exception as e:
            return jsonify({"success": False, "message": "An error occurred", "details": str(e)}), 500

    def dict_to_peewee_expression(self, query_dict):
        """Convert dictionary filters to Peewee expressions"""

        expressions = []
        operator_map = {
            'gt': operator.gt,
            'gte': operator.ge,
            'lt': operator.lt,
            'lte': operator.le,
            'contains': lambda f, v: f.contains(v),
            'startswith': lambda f, v: f.startswith(v),
            'endswith': lambda f, v: f.endswith(v),
            'in': lambda f, v: f.in_(v),
            'isnull': lambda f, v: f.is_null(bool(v)),
        }

        for key, value in query_dict.items():
            # Skip None values and special keys
            if value is None or key in ['recursive', 'page', 'limit']:
                continue

            # Split the key to check for operators
            key_parts = key.split('__')
            field_name = key_parts[0]
            operator_name = key_parts[1] if len(key_parts) > 1 else 'exact'

            try:
                field = getattr(self.model, field_name)
            except AttributeError:
                continue  # Skip if field doesn't exist

            if operator_name == 'exact':
                expressions.append(field == value)
            elif operator_name in operator_map:
                expressions.append(operator_map[operator_name](field, value))

        return reduce(and_, expressions) if expressions else True

    def apply_query_filters(self, query, query_dict):
        """Apply filters and pagination to query"""
        expression = self.dict_to_peewee_expression(query_dict)
        if expression is not True:
            query = query.where(expression)

        # Handle pagination
        page = int(query_dict.get('page', 1))
        limit = int(query_dict.get('limit', 50))
        if page and limit:
            query = query.paginate(page, limit)

        return query
