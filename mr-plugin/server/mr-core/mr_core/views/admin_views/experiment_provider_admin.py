from mr_core import models
from .read_write_admin import ReadWriteAdminView


class ExperimentProviderAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'name',
                   'title',
                   'description',
                   'url',
                   'is_active',
                   'configs',
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    column_searchable_list = ('title', 'name', 'description')
    form_columns = ('name',
                    'title',
                    'description',
                    'url',
                    'is_active',
                    'configs',
                    'created_by')

    def __init__(self):
        super().__init__(model=models.ExperimentProvider)
