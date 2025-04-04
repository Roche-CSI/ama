from flask import g

from .app_secret import AppSecret
from .asset import Asset
from .asset_class import AssetClass
from .asset_class_content_relations import AssetClassContentRelations
from .asset_object_relations import AssetObjectRelations
from .asset_ref import AssetRef
from .asset_ref import AssetRef
from .asset_settings import AssetSettings
from .asset_version import AssetVersion
from .auth_provider import AuthProvider
from .bucket import Bucket
from .content import Content
from .object import Object
from .project import Project
from .project_bucket_relations import ProjectBucketRelations
from .role import Role
from .tag_queries import TagQueries
from .tag_refs import TagRefs
from .tags import Tags
from .template import Template
from .template_entity_relations import TemplateEntityRelations
from .user import User
from .user_role import UserRole
from .version_counter import VersionCounter
from .webhook import Webhook
from .webhook_status import WebhookStatus


def create_tables(database=None):
    database = database or g.db
    with database:
        database.create_tables([AssetClass,
                                Asset,
                                VersionCounter,
                                AssetRef,
                                Content,
                                AssetClassContentRelations,
                                Object,
                                AssetObjectRelations,
                                AssetVersion,
                                AuthProvider,
                                Project,
                                User,
                                Role,
                                UserRole,
                                AssetSettings,
                                Tags,
                                TagRefs,
                                TagQueries,
                                AppSecret,
                                Bucket,
                                Template,
                                TemplateEntityRelations,
                                Webhook,
                                WebhookStatus,
                                ProjectBucketRelations
                                ])


def delete_tables(database=None):
    database = database or g.db
    with database:
        database.drop_tables([AssetObjectRelations,
                              Object,
                              AssetRef,
                              AssetClassContentRelations,
                              Content,
                              VersionCounter,
                              AssetClass,
                              Asset,
                              AssetVersion,
                              AuthProvider,
                              Project,
                              User,
                              Role,
                              UserRole,
                              AssetSettings,
                              Tags,
                              TagRefs,
                              TagQueries,
                              AppSecret,
                              Bucket,
                              Template,
                              Webhook,
                              WebhookStatus,
                              TemplateEntityRelations,
                              ProjectBucketRelations
                              ])
