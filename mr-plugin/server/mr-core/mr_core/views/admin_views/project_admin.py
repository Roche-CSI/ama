from mr_core import models
from .read_write_admin import ReadWriteAdminView
from flask import flash
from flask_admin.babel import gettext


class ProjectAdmin(ReadWriteAdminView):
    can_delete = True
    column_list = ('id',
                   'name',
                   'description',
                   'created_at',
                   'url',
                   'data_types',
                   'admin',
                   'created_by',
                   'readme_md'
                   )
    column_searchable_list = ['name']
   

    def __init__(self):
        super().__init__(model=models.Project)

    def delete_model(self, model):
        try:
            username = "postgres"
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