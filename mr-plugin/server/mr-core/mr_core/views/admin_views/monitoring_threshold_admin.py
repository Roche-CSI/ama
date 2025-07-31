from mr_core import models
from .read_write_admin import ReadWriteAdminView


class MonitoringThresholdAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'run_id',
                   'metric_type',
                   'metric_name',
                   'threshold_value',
                   'comparison_operator',
                   'severity',
                   'enabled',
                   'metadata'
                   'created_at',
                   'created_by',
                   'modified_at',
                   'modified_by')
    column_searchable_list = ('metric_type',)
    form_columns = ('run_id',
                   'metric_type',
                   'metric_name',
                   'threshold_value',
                   'comparison_operator',
                   'severity',
                   'enabled',
                   'metadata'
                   'created_by')

    def __init__(self):
        super().__init__(model=models.MonitoringThreshold)
