from flask import g
from peewee import PostgresqlDatabase, SqliteDatabase

from amapy_server.configs import Configs
from amapy_server.models.base.base import db_proxy
from amapy_server.configs.database_selector import DatabaseSelector

def get_db(app):
    db_cfg = Configs.shared().DATABASE
    with app.app_context():
        if 'db' not in g:
            # Determine database type
            db_type = DatabaseSelector.get_database_type()
            
            if db_type == 'sqlite':
                # Use SQLite
                sqlite_path = DatabaseSelector.get_sqlite_path()
                g.db = SqliteDatabase(sqlite_path, pragmas={
                    'journal_mode': 'wal',
                    'foreign_keys': 1,
                    'cache_size': -1024 * 64
                })
            else:
                # Use PostgreSQL
                postgres_cred = {
                    'user': db_cfg['user'],
                    'password': db_cfg['password'],
                    'host': db_cfg['host'],
                    'port': db_cfg['port']
                }
                g.db = PostgresqlDatabase(db_cfg["database"], **postgres_cred)   
            # Initialize the database proxy
            db_proxy.initialize(g.db)
        return g.db
