from amapy_server import models
from .readonly_admin import ReadOnlyAdminView


class AssetClassContentRelationsAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'asset_class',
                   'content',
                   'created_at',
                   'created_by',
                   )

    def __init__(self):
        super().__init__(model=models.AssetClassContentRelations)
