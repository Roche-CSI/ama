from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from playhouse.postgres_ext import JSONField
from .action_provider import ActionProvider


class Action(ReadWriteModel):
    """
    Defines an action with provider-specific implementation
    """
    provider = ForeignKeyField(ActionProvider, backref='actions')
    name = CharField()  # e.g., 'create_issue', 'update_status'
    title = CharField()  # e.g., 'Create Issue', 'Update Status'
    description = TextField(null=True)
    api_config = JSONField(null=True)  # Provider-specific configuration i.e. endpoint, method, headers etc.
    # Input schema for this action
    input_schema = JSONField()  # JSON Schema for action inputs
    # Template for request/action formatting
    request_template = JSONField(null=True)  # Template for formatting requests

    class Meta:
        indexes = (
            (('name', 'provider'), True),  # Composite unique index
        )

    """
    The key benefits of using request_template are:
    * Standardization: You can keep your input data format consistent across your application while adapting it to different providers
    * Transformation: It allows you to transform data format without changing your input:
    * Field renaming: e.g., 'title' to 'summary' for JIRA
    * Data restructuring: e.g., flat structure to nested JSON
    * Value transformation: e.g., converting priority to uppercase
    * Maintainability: If a provider changes their API format, you only need to update the template, not your application code
    * Flexibility: You can:
      - Add default values
      - Transform data types
      - Create nested structures
      - Handle arrays and complex objects
    * The template system acts as a contract between your standardized input data and the variety of formats different providers might expect in their APIs.
    
    # Example 1: GitHub Issue Creation
    github_issue_action = Action.create(
        name='create_issue',
        title='Create GitHub Issue',
        description='Creates a new issue in GitHub repository',
        provider=github_provider,
        api_config={
            'endpoint': '/repos/{owner}/{repo}/issues',
            'method': 'POST',
            'headers': {
                'Authorization': 'Bearer {api_token}',
                'Accept': 'application/vnd.github.v3+json'
            }
        },
        input_schema={
            'type': 'object',
            'properties': {
                'title': {'type': 'string'},
                'body': {'type': 'string'},
                'labels': {'type': 'array', 'items': {'type': 'string'}},
                'assignees': {'type': 'array', 'items': {'type': 'string'}}
            },
            'required': ['title', 'body']
        },
        request_template={
            'title': '{title}',
            'body': '{body}',
            'labels': '{labels}',
            'assignees': '{assignees}',
            '__template_version': '1.0'
        }
    )

    # Example 2: JIRA Issue Creation with Complex Fields
    jira_issue_action = Action.create(
        name='create_issue',
        title='Create JIRA Issue',
        description='Creates a new issue in JIRA project',
        provider=jira_provider,
        api_config={
            'endpoint': '/rest/api/2/issue',
            'method': 'POST',
            'headers': {
                'Authorization': 'Basic {credentials}',
                'Content-Type': 'application/json'
            }
        },
        input_schema={
            'type': 'object',
            'properties': {
                'project_key': {'type': 'string'},
                'summary': {'type': 'string'},
                'description': {'type': 'string'},
                'issue_type': {'type': 'string'},
                'priority': {'type': 'string'},
                'components': {'type': 'array', 'items': {'type': 'string'}}
            },
            'required': ['project_key', 'summary', 'description']
        },
        request_template={
            'fields': {
                'project': {'key': '{project_key}'},
                'summary': '{summary}',
                'description': '{description}',
                'issuetype': {'name': '{issue_type|default:Task}'},
                'priority': {'name': '{priority|upper}'},
                'components': [{'name': '{each.components}'} ],
            },
            '__template_version': '1.0'
        }
    )

    # Example 3: Slack Message with Blocks
    slack_notification_action = Action.create(
        name='send_notification',
        title='Send Slack Notification',
        description='Sends a notification to Slack channel',
        provider=slack_provider,
        api_config={
            'endpoint': '/api/chat.postMessage',
            'method': 'POST',
            'headers': {
                'Authorization': 'Bearer {bot_token}',
                'Content-Type': 'application/json'
            }
        },
        input_schema={
            'type': 'object',
            'properties': {
                'channel': {'type': 'string'},
                'title': {'type': 'string'},
                'message': {'type': 'string'},
                'metrics': {
                    'type': 'object',
                    'properties': {
                        'accuracy': {'type': 'number'},
                        'loss': {'type': 'number'}
                    }
                }
            },
            'required': ['channel', 'title', 'message']
        },
        request_template={
            'channel': '{channel}',
            'blocks': [
                {
                    'type': 'header',
                    'text': {
                        'type': 'plain_text',
                        'text': '{title}'
                    }
                },
                {
                    'type': 'section',
                    'text': {
                        'type': 'mrkdwn',
                        'text': '{message}'
                    }
                },
                {
                    'type': 'section',
                    'fields': [
                        {
                            'type': 'mrkdwn',
                            'text': '*Accuracy:*\n{metrics.accuracy|format:.2f}%'
                        },
                        {
                            'type': 'mrkdwn',
                            'text': '*Loss:*\n{metrics.loss|format:.4f}'
                        }
                    ]
                }
            ],
            '__template_version': '1.0'
        }
    )
    
    # Example 4: AWS Lambda Invocation
    lambda_action = Action.create(
        name='invoke_lambda',
        title='Invoke AWS Lambda',
        description='Invokes an AWS Lambda function',
        provider=aws_provider,
        api_config={
            'service': 'lambda',
            'operation': 'invoke',
            'region': '{aws_region}'
        },
        input_schema={
            'type': 'object',
            'properties': {
                'function_name': {'type': 'string'},
                'model_data': {
                    'type': 'object',
                    'properties': {
                        'model_id': {'type': 'string'},
                        'version': {'type': 'string'},
                        'metrics': {'type': 'object'}
                    }
                },
                'environment': {'type': 'string'}
            },
            'required': ['function_name', 'model_data']
        },
        request_template={
            'FunctionName': '{function_name}',
            'InvocationType': 'RequestResponse',
            'Payload': {
                'model': {
                    'id': '{model_data.model_id}',
                    'version': '{model_data.version}',
                    'metrics': '{model_data.metrics}',
                    'timestamp': '{now|isoformat}',
                    'environment': '{environment|default:production}'
                },
                '__context': {
                    'source': 'model_registry',
                    'action_id': '{action_id}'
                }
            },
            '__template_version': '1.0'
        }
    )
    
    # Example usage of these actions:
    github_config = {
        'title': 'Model Performance Alert',
        'body': 'Accuracy dropped below threshold',
        'labels': ['alert', 'model-performance'],
        'assignees': ['data-team']
    }
    
    jira_config = {
        'project_key': 'ML',
        'summary': 'Model Performance Alert',
        'description': 'Accuracy dropped below threshold',
        'issue_type': 'Bug',
        'priority': 'high',
        'components': ['model-monitoring', 'alerts']
    }
    
    slack_config = {
        'channel': '#model-alerts',
        'title': 'Model Performance Alert',
        'message': 'The production model performance has degraded',
        'metrics': {
            'accuracy': 92.5,
            'loss': 0.0876
        }
    }
    
    lambda_config = {
        'function_name': 'model-alert-handler',
        'model_data': {
            'model_id': 'fraud-detection-v1',
            'version': '1.2.3',
            'metrics': {
                'accuracy': 0.925,
                'precision': 0.91,
                'recall': 0.89
            }
        },
        'environment': 'production'
    }
        """
