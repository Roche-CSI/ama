from flask import flash
from flask_admin.babel import gettext

from amapy_server import models
from .read_write_admin import ReadWriteAdminView


class TagRefsAdmin(ReadWriteAdminView):
    can_delete = True
    column_list = ('id',
                   'tag_id',
                   'table_name',
                   'record_id',
                   'is_primary'
                   )
    column_searchable_list = ['table_name', 'record_id']
    form_columns = ['tag_id',
                    'table_name',
                    'record_id',
                    'is_primary'
                    ]

    def __init__(self):
        super().__init__(model=models.TagRefs)

    def delete_model(self, model):
        try:
            username = self.get_username()
            self.on_model_delete(model)
            model.delete_instance(user=username, recursive=True, permanently=True)
        except Exception as ex:
            if not self.handle_view_exception(ex):
                flash(gettext('Failed to delete record. %(error)s', error=str(ex)), 'error')
                self.log.exception('Failed to delete record.')
            return False
        else:
            self.after_model_delete(model)

        return True
