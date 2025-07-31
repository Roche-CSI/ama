from mr_core import models
from .read_write_admin import ReadWriteAdminView


class ActionRunAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'asset_action',
                   'description',
                   'state',
                   'created_at',
                   'created_by')
    # column_searchable_list = ('id', 'asset_id', 'action_id')
    form_columns = ('asset_action',
                    'description',
                    'state',
                    'created_by')

    def __init__(self):
        super().__init__(model=models.ActionRun)
