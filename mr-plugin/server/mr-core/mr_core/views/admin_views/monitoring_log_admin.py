from mr_core import models
from .read_write_admin import ReadOnlyAdminView


class MonitoringLogAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'run_id',
                   'timestamp',
                   'level',
                   'message',
                   'metadata'
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')

    column_searchable_list = ('message',)

    def __init__(self):
        super().__init__(model=models.MonitoringLog)
