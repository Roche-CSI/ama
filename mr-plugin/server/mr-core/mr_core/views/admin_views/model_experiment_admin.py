from mr_core import models
from .read_write_admin import ReadOnlyAdminView


class ModelExperimentAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   "asset_id",
                   "provider",
                   "experiment_id",
                   "data",
                   'created_at',
                   'created_by',
                   )

    def __init__(self):
        super().__init__(model=models.ModelExperiment)
