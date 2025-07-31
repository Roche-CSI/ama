from mr_core import models
from .read_write_admin import ReadOnlyAdminView


class MonitoringAlertAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'run_id',
                   'metric_record',
                   'timestamp',
                   'severity',
                   'category',
                   'severity',
                   'message',
                   'metadata'
                   'resolved',
                   'resolved_at'
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')

    column_searchable_list = ('message',)

    def __init__(self):
        super().__init__(model=models.MonitoringAlert)
