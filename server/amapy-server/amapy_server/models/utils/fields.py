from peewee import TextField, CharField, fn, SQL, Expression, OP, UUIDField as PeeweeUUIDField
from playhouse.postgres_ext import JSONField as PostgresJSONField
from playhouse.postgres_ext import BinaryJSONField as PostgresBinaryJSONField
from playhouse.postgres_ext import Cast, Json
import json
import uuid
from amapy_server.configs.database_selector import DatabaseSelector

class JSONFieldMixin:
    """
    Mixin that provides cross-database JSON field functionality.
    This mixin overrides methods from playhouse.postgres_ext.JSONField
    to make them work with both PostgreSQL and SQLite.
    """
    
    def db_value(self, value):
        """Convert Python value to database format"""
        if value is None:
            return None
            
        if self._is_sqlite_database():
            return json.dumps(value) # For SQLite, store as JSON string
        else:
            if hasattr(super(), 'db_value'):
                return super().db_value(value)
            elif not isinstance(value, Json):
                return Cast(json.dumps(value), self._json_type())
            return value
    
    def python_value(self, value):
        """Convert database value to Python object"""
        if value is None:
            return None
            
        if self._is_sqlite_database():
            # For SQLite, parse JSON string
            if isinstance(value, str):
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    return value
            return value
        else:
            # For PostgreSQL, use the original implementation
            if hasattr(super(), 'python_value'):
                return super().python_value(value)
            if isinstance(value, str):
                try:
                    return json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    return value
            return value
    
    def add_to_class(self, model_class, name):
        """Handle field addition to class, preventing USING syntax for SQLite"""
        if self._is_sqlite_database():
            # For SQLite, skip PostgreSQL-specific index creation
            try:
                field_type = self.field_type
                self.field_type = 'TEXT'  # Ensure it's treated as TEXT
                # Call TextField's add_to_class
                result = TextField.add_to_class(self, model_class, name)
                return result
            finally:
                self.field_type = field_type
        else:
            # For PostgreSQL, use the original implementation
            return super().add_to_class(model_class, name)

    def _is_sqlite_database(self):
        """Check if we're using SQLite database"""
        return DatabaseSelector.get_database_type() == 'sqlite'
    
    def _json_type(self):
        """Get the JSON type (json or jsonb) based on the field class"""
        if isinstance(self, BinaryJSONField):
            return 'jsonb'
        return 'json'

    def search(self, term):
        """
        Search for a term within JSON data.
        Supports both SQLite (using json_extract) and PostgreSQL (using LIKE on casted text).
        """
        if self._is_sqlite_database():
            search_text = term if isinstance(term, str) else json.dumps(term)
            return fn.json_extract(self, '$') ** f'%{search_text}%'
        else:
            # PostgreSQL: cast to text and do LIKE search
            if isinstance(term, str):
                search_text = term
            else:
                search_text = json.dumps(term)
            return Expression(SQL(f"CAST({self.as_entity()} AS text)"), 'ILIKE', f'%{search_text}%')
            
  
    def __getitem__(self, key):
        """Access a specific key in the JSON data"""
        if self._is_sqlite_database():
            # Use SQLite's json_extract function
            return fn.json_extract(self, f'$.{key}')
        else:
            if hasattr(super(), '__getitem__'):
                return super().__getitem__(key)
            return Expression(self, '->', key)
    
    def path(self, *path_elements):
        """Extract a value at a specific path in the JSON"""
        if self._is_sqlite_database():
            # Use SQLite's json_extract with path
            path = '$.' + '.'.join(str(p) for p in path_elements)
            return fn.json_extract(self, path)
        else:
            if hasattr(super(), 'path'):
                return super().path(*path_elements)
            # Fallback implementation for PostgreSQL
            result = self
            for elem in path_elements:
                result = result[elem]
            return result
    
    def length(self):
        """Get the length of a JSON array or object"""
        if self._is_sqlite_database():
            # Use SQLite's json_array_length
            return fn.json_array_length(self, '$')
        else:
            # For PostgreSQL, use jsonb_array_length
            if hasattr(super(), 'length'):
                return super().length()
            return fn.jsonb_array_length(self)
    
    def extract(self, path):
        """Extract a value using a JSON path expression"""
        if self._is_sqlite_database():
            # Use SQLite's json_extract
            return fn.json_extract(self, path)
        else:
            # For PostgreSQL, use the original implementation
            if hasattr(super(), 'extract'):
                return super().extract(path)
            # Fallback implementation for PostgreSQL
            return fn.jsonb_extract_path(self, path)


class JSONField(JSONFieldMixin, PostgresJSONField):
    """
    Cross-database compatible JSON field.
    Uses JSONFieldMixin methods first (overriding PostgresJSONField),
    but falls back to PostgresJSONField for anything not overridden.
    """
    field_type = 'TEXT'  # Use TEXT for SQLite compatibility
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set the field type based on the database
        if not self._is_sqlite_database():
            self.field_type = 'JSON'


class BinaryJSONField(JSONFieldMixin, PostgresBinaryJSONField):
    """
    Cross-database compatible JSONB field.
    Uses JSONFieldMixin methods first (overriding PostgresBinaryJSONField),
    but falls back to PostgresBinaryJSONField for anything not overridden.
    """
    field_type = 'TEXT'  # Use TEXT for SQLite compatibility
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set the field type based on the database
        if not self._is_sqlite_database():
            self.field_type = 'JSONB'


# Custom UUID field function
def UUIDField(primary_key=True, unique=True, default=None):
    """Cross-database compatible UUID field"""
    if default is None:
        default = lambda: str(uuid.uuid4())

    if DatabaseSelector.get_database_type() != 'sqlite':
        return PeeweeUUIDField(primary_key=primary_key, unique=unique, default=default)
    else:
        return CharField(36, primary_key=primary_key, unique=unique, default=default)
