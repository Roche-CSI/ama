# models/fields.py
from peewee import TextField, UUIDField as PeeweeUUIDField, CharField
import uuid
import json
from playhouse.postgres_ext import Cast, Json
from amapy_server.configs.database_selector import DatabaseSelector


class JSONFieldBase(TextField):
    """Base class for JSON fields"""
    
    def db_value(self, value):
        if value is None:
            return None
            
        if DatabaseSelector.get_database_type() == 'postgresql':
            # For PostgreSQL, let the native field handle it
            return self._pg_db_value(value)
        else:
            # For SQLite, convert to JSON string
            return json.dumps(value)
    
    def python_value(self, value):
        if value is None:
            return None
            
        if DatabaseSelector.get_database_type() == 'postgresql':
            # For PostgreSQL, let the native field handle it
            return self._pg_python_value(value)
        else:
            # For SQLite, parse JSON string
            if isinstance(value, str):
                return json.loads(value)
            return value  # Already a Python object
    
    def _pg_db_value(self, value):
        """PostgreSQL-specific db_value implementation"""
        return value
    
    def _pg_python_value(self, value):
        """PostgreSQL-specific python_value implementation"""
        return value

class JSONField(JSONFieldBase):
    """JSON field that works with both PostgreSQL and SQLite"""
    
    # Add the missing dumps method
    def dumps(self, value):
        return json.dumps(value)
    
    def _pg_db_value(self, value):
        # Import here to avoid issues if psycopg2 is not available
        if not isinstance(value, Json):
            return Cast(self.dumps(value), 'json')
        return value
    
    def _pg_python_value(self, value):
        if isinstance(value, str):
            return json.loads(value)
        return value

class BinaryJSONField(JSONFieldBase):
    """JSONB field that works with both PostgreSQL and SQLite"""
    
    # Add the missing dumps method
    def dumps(self, value):
        return json.dumps(value)
    
    def _pg_db_value(self, value):
        if not isinstance(value, Json):
            return Cast(self.dumps(value), 'jsonb')
        return value
    
    def _pg_python_value(self, value):
        if isinstance(value, str):
            return json.loads(value)
        return value

# Custom UUID field
def UUIDField(primary_key=True, unique=True, default=None):
    if default is None:
        default = lambda: str(uuid.uuid4())

    if DatabaseSelector.get_database_type() != 'sqlite':
        return PeeweeUUIDField(primary_key=primary_key, unique=unique, default=default)
    else:
        return CharField(36, primary_key=primary_key, unique=unique, default=default)
