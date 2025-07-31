from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView

class TagAdmin(ReadOnlyAdminView):
    column_list=('id',
                 'name',
                 'catagory_id')
    column_searchable_list = []
    def __init__(self):
        super().__init__(model=models.Tag)