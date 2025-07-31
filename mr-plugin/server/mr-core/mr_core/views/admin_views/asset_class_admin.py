from mr_core import models
from .read_write_admin import ReadWriteAdminView


class AssetClassAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'project',
                   'name',
                   'title',
                   'description',
                   'class_type',
                   'attributes',
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by',
                   'metadata')
    column_searchable_list = ('title', 'name', 'class_type')
    form_columns = ('project',
                    'name',
                    'title',
                    'description',
                    'class_type',
                    'created_at',
                    'created_by',
                    'modified_at',
                    'modified_by',
                    'metadata')

    def __init__(self):
        super().__init__(model=models.AssetClass)
