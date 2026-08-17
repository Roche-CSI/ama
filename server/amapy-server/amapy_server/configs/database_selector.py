import os

class DatabaseSelector:
    """Determines which database type should be used"""
    
    @staticmethod
    def get_database_type():
        """
        Determine which database type to use
        
        Returns:
            str: 'sqlite' or 'postgresql'
        """
        # Check environment variable
        db_type = os.environ.get('DB_TYPE', '').lower()
        
        if db_type in ('sqlite', 'sqlite3'):
            return 'sqlite'
        else:
            return 'postgresql'  # Default
            # If not specified in environment, check config
        
    @staticmethod
    def get_sqlite_path():
        """Get SQLite database file path"""
        return os.environ.get('SQLITE_PATH', 'amapy.db')