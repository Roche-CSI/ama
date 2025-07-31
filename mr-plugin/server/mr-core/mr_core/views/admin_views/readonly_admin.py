from flask import flash
from flask_admin.contrib.peewee import ModelView
from flask_admin.actions import action
from markupsafe import Markup
from flask_admin.model import typefmt
import flask_login as login
import json


def json_formatter(view, value):
    json_value = json.dumps(value, ensure_ascii=False, indent=2)
    return Markup('<pre style="min-width:300px;background:none">{}</pre>'.format(json_value))


# copy the existing formatters
MY_FORMATTERS = typefmt.BASE_FORMATTERS.copy()
# add custom formatters for dict and list data types
MY_FORMATTERS[dict] = json_formatter
MY_FORMATTERS[list] = json_formatter


class ReadOnlyAdminView(ModelView):
    can_create = False
    can_edit = False
    can_delete = False
    # adds a left blank column otherwise
    column_display_actions = False
    column_type_formatters = MY_FORMATTERS

   

   

 