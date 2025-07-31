from mr_core import models
from .read_write_admin import ReadWriteAdminView


class ActionAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'name',
                   'title',
                   'description',
                   'provider_id',
                   'api_config',
                   'input_schema',
                   'request_template',
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    column_searchable_list = ('title', 'name', 'description')
    form_columns = ('name',
                    'title',
                    'description',
                    'provider_id',
                    'api_config',
                    'input_schema',
                    'request_template',
                    'created_by')

    def __init__(self):
        super().__init__(model=models.Action)
