from mr_core import models
from .read_write_admin import ReadWriteAdminView


class MonitoringMetricsAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'run',
                   'timestamp',
                   'category',
                   'metric_type',
                   'metric_name',
                   'metric_value',
                   'metric_details',
                   'dimensions',
                   'metadata'
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    column_searchable_list = ('metric_type',)
    form_columns = ('run_id',
                    'timestamp',
                    'category',
                    'metric_type',
                    'metric_name',
                    'metric_value',
                    'metric_details',
                    'dimensions'
                    'metadata'
                    'created_by')

    def __init__(self):
        super().__init__(model=models.MonitoringMetrics)
