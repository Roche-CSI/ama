from amapy_server import models
from .readonly_admin import ReadOnlyAdminView


class ContentAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'mime_type',
                   'hash',
                   'size',
                   'meta',
                   'created_at',
                   'created_by',
                   )

    def __init__(self):
        super().__init__(model=models.Content)
