from flask import flash
from mr_core import models
from .readonly_admin import ReadOnlyAdminView

class DeploymentAdmin(ReadOnlyAdminView):
    column_list=('id',
                 'name',
                 'description',
                 'created_at',
                 'updated_at',
                 'url',
                 'model_id',
                 'owner',
                 'machine_config',
                 'status',
                 'logs_url',
                 'metrics',
                 'deployment_environment',
                 'tags'
                )
    column_searchable_list = []
    
    def __init__(self):
        super().__init__(model=models.Deployment)