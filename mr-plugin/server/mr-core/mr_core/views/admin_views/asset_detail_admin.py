from mr_core import models
from .read_write_admin import ReadWriteAdminView


class AssetDetailAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'card',
                   'created_at',
                   'created_by',
                   )
    # column_searchable_list = ('title', 'name', 'class_type')
    form_columns = ('id',
                    'created_by',
                    'card')

    def __init__(self):
        super().__init__(model=models.AssetDetail)
