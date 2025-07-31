from mr_core import models
from .read_write_admin import ReadWriteAdminView


class DatasetAdmin(ReadWriteAdminView):
    column_list=('id',
                 'name',
                 'description',
                 'created_at',
                 'modified_at',
                 'url',
                 'owner',
                 'size',
                 'likes',
                 'downloads',
                 'format',
                 'num_records',
                 'tags',
                 'license',
                 'version',
                 'metadata')

    column_searchable_list = []
    
    def __init__(self):
        super().__init__(model=models.Dataset)