from amapy_server import models
from .readonly_admin import ReadOnlyAdminView


class ObjectAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'url_id',
                   'content',
                   'meta',
                   'created_at',
                   'created_by',
                   )

    def __init__(self):
        super().__init__(model=models.Object)
