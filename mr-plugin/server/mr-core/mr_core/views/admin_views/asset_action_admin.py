from mr_core import models
from .read_write_admin import ReadWriteAdminView


class AssetActionAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'asset_id',
                   'action_id',
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    # column_searchable_list = ('id', 'asset_id', 'action_id')
    form_columns = ('asset_id',
                    'action_id',
                    'created_by')

    def __init__(self):
        super().__init__(model=models.AssetAction)
