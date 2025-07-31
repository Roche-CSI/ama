from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView

class EntityGroupAdmin(ReadOnlyAdminView):
    column_list=('id',
                 'name',
                 'description',
                 'created_by',
                 'created_at',
                 'modified_at',
                 'groups')
    column_searchable_list = []
    
    def __init__(self):
        super().__init__(model=models.EntityGroup)