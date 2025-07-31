from peewee import *
from mr_core.models.base.read_write import ReadWriteModel
from playhouse.postgres_ext import JSONField
from datetime import datetime, timedelta
from .asset_action import AssetAction


class ActionRun(ReadWriteModel):
    """
    Records of action executions with retry and cancel capabilities, including logs
    """
    asset_action = ForeignKeyField(AssetAction, backref='runs')
    description = CharField(null=True)  # Description of the action run
    state = CharField()  # 'pending', 'running', 'completed', 'failed', 'cancelled', 'retry_pending'
    attempt_number = IntegerField(default=1)  # Track retry attempts
    max_retries = IntegerField(default=3)  # Maximum number of retry attempts allowed

    started_at = DateTimeField(null=True)
    completed_at = DateTimeField(null=True)

    # Execution details
    input_data = JSONField()  # Actual input data used
    output_data = JSONField(null=True)  # Results/response from the action
    error_message = TextField(null=True)
    error_type = CharField(null=True)  # Type of error for better retry handling

    # Provider-specific response
    provider_response = JSONField(null=True)  # Raw response from provider

    # Retry configuration
    retry_strategy = JSONField(null=True)  # e.g., {'backoff': 'exponential', 'initial_delay': 5}
    next_retry_at = DateTimeField(null=True)  # Scheduled time for next retry attempt

    # Cancellation details
    cancelled_by = CharField(null=True)  # User who cancelled the action
    cancel_reason = TextField(null=True)  # Reason for cancellation

    # Execution logs as JSON array
    essential_logs = JSONField(default=list)  # [{timestamp, level, message, metadata}, ...]
    detailed_logs = JSONField(default=dict)  # bucket_url

    def add_log(self, level, message, metadata=None):
        """Add a log entry to the execution"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'level': level,
            'message': message,
            'metadata': metadata or {}
        }
        self.logs.append(log_entry)
        self.save()

    def can_retry(self):
        """Check if the action can be retried"""
        return (
                self.status in ['failed', 'cancelled'] and
                self.attempt_number < self.max_retries
        )

    def can_cancel(self):
        """Check if the action can be cancelled"""
        return self.status in ['pending', 'running', 'retry_pending']

    def retry(self, user_id):
        """Retry the action execution"""
        if not self.can_retry():
            raise ValueError("Action cannot be retried")

        self.state = 'retry_pending'
        self.attempt_number += 1
        self.error_message = None
        self.error_type = None
        self.started_at = None
        self.completed_at = None

        self.add_log(
            level='info',
            message=f'Retry attempt {self.attempt_number} initiated',
            metadata={
                'user_id': user_id,
                'attempt_number': self.attempt_number
            }
        )
        self.save()

    def cancel(self, user_id, reason=None):
        """Cancel the action execution"""
        if not self.can_cancel():
            raise ValueError("Action cannot be cancelled")

        self.state = 'cancelled'
        self.cancelled_by = user_id
        self.cancel_reason = reason
        self.completed_at = datetime.now()

        self.add_log(
            level='info',
            message='Action cancelled',
            metadata={
                'user_id': user_id,
                'reason': reason
            }
        )
        self.save()

    def start(self):
        """Start the action execution"""
        self.state = 'running'
        self.started_at = datetime.now()
        self.add_log(
            level='info',
            message='Action started',
            metadata={'attempt_number': self.attempt_number}
        )
        self.save()

    def complete(self, output_data=None, provider_response=None):
        """Mark the action as completed"""
        self.state = 'completed'
        self.completed_at = datetime.now()
        self.output_data = output_data
        self.provider_response = provider_response
        self.add_log(
            level='info',
            message='Action completed successfully',
            metadata={'output_data': output_data}
        )
        self.save()

    def fail(self, error_message, error_type=None, provider_response=None):
        """Mark the action as failed"""
        self.state = 'failed'
        self.completed_at = datetime.now()
        self.error_message = error_message
        self.error_type = error_type
        self.provider_response = provider_response
        self.add_log(
            level='error',
            message=f'Action failed: {error_message}',
            metadata={
                'error_type': error_type,
                'provider_response': provider_response
            }
        )
        self.save()