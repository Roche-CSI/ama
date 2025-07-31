from mr_core import models
from .read_write_admin import ReadWriteAdminView


class MonitoringRunAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'asset_id',
                   'provider',
                   'start_time',
                   'end_time',
                   'state',
                   'configuration',
                   'data_snapshot',
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    column_searchable_list = ('state',)
    form_columns = ('asset_id',
                    'provider',
                    'start_time',
                    'end_time',
                    'state',
                    'configuration',
                    'data_snapshot',
                    'created_by')

    def __init__(self):
        super().__init__(model=models.MonitoringRun)
