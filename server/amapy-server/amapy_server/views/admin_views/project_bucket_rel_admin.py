from amapy_server import models
from .read_write_admin import ReadWriteAdminView


class AssetObjectRelationsAdmin(ReadWriteAdminView):
    column_list = ('id',
                   'project',
                   'buckets',
                   'configs',
                   'created_at',
                   'created_by',
                   )

    def __init__(self):
        super().__init__(model=models.AssetObjectRelations)
