from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView

class TaggableGroupAdmin(ReadOnlyAdminView):
    column_list=('id',
                 'name',
                 'entity_group_id',
                 'entity_group_name',
                 'description',
                 'created_by',
                 'created_at',
                 'modified_at')
    column_searchable_list = []
    def __init__(self):
        super().__init__(model=models.TaggableGroup)