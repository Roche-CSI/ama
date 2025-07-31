from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView

class TaggableCategoryAdmin(ReadOnlyAdminView):
    column_list=('id',
                 'name',
                 'group_id',
                 'group_name',
                 'description',
                 'created_by',
                 'created_at',
                 'modified_at',
                 'readme_md')
    column_searchable_list = []
    def __init__(self):
        super().__init__(model=models.TaggableCategory)