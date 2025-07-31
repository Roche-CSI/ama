from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView


class MlModelAdmin(ReadOnlyAdminView):
    column_list = ('id',
                   'name',
                   'description',
                   'tags',
                   'license',
                   'author',
                   'created_at',
                   'created_by',
                   'downloads',
                   'likes',
                   'type',
                   'language',
                   'tasks',
                   'architecture',
                   'parameters',
                   'training_data',
                   'evaluation_metrics',
                   'example_inputs',
                   'example_outputs'
                   )
    column_searchable_list = []
    def __init__(self):
        super().__init__(model=models.MlModel)

   