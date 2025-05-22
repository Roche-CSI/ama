#!/usr/bin/env python3
import json
import logging
import unittest
from peewee import Model, CharField, fn, Cast
from playhouse.postgres_ext import  PostgresqlDatabase, SqliteDatabase
from amapy_server.models.utils.fields import JSONField
logging.basicConfig(level=logging.DEBUG)
from amapy_server.configs.database_selector import DatabaseSelector


# Configure database selection for testing
class TestDatabaseSelector:
    _db_type = 'sqlite'
    
    @classmethod
    def get_database_type(cls):
        return cls._db_type

# Replace the actual DatabaseSelector with our test version
original_get_database_type = DatabaseSelector.get_database_type
DatabaseSelector.get_database_type = TestDatabaseSelector.get_database_type

# PostgreSQL connection settings - adjust these to match your environment
DB_NAME = 'asset_test_db'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'
DB_HOST = 'localhost'
DB_PORT = 5432

# Define a simple test model
class SimpleTestModel(Model):
    name = CharField()
    data = JSONField(default=list)
    class Meta:
        # Will be set in tests
        database = SqliteDatabase(':memory:')

TEST_DATA =[
    {
        "name": "User Profile",
        "data": {
            "username": "john_doe",
            "email": "john@example.com",
            "settings": {
                "theme": "dark",
                "notifications": True
            }
        }
    },

    {
        "name": "Product Item",
        "data": {
            "product_name": "dark",
            "price": 599.99,
            "tags": ["electronics", "mobile", "dar"]
        }
    },
    {
        "name": "Article",
        "data": {
            "title": "Important News",
            "content": "This is an important article about technology",
            "published": True
        }
    }
]

class JSONFieldMixinTestCase(unittest.TestCase):
    
    def setUp(self):
        # Create sample data for all tests
        self.simple_data = TEST_DATA

    def db_setup_postgres(self):    
        try:
            db = PostgresqlDatabase(
                DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT
            )
            SimpleTestModel._meta.database = db
            db.connect()
            db.execute_sql('DROP TABLE IF EXISTS simpletestmodel;')
            db.create_tables([SimpleTestModel])
            print("Inserting test data...")
            for item in TEST_DATA:
                SimpleTestModel.create(name=item["name"], data=item["data"])
            
            print(f"Created {len(TEST_DATA)} test records\n")
            return db
        except Exception as e:
            raise e

    def db_setup_sqlite(self):
        db = SqliteDatabase(':memory:')
        db.connect()
        db.execute_sql('DROP TABLE IF EXISTS simpletestmodel;')
        db.create_tables([SimpleTestModel])
        # Insert test data
        for item in TEST_DATA:
            SimpleTestModel.create(name=item["name"], data=item["data"])
        
        return db

    def tearDown(self):
        """Clean up after each test"""
        if hasattr(SimpleTestModel._meta.database, 'close'):
            if not SimpleTestModel._meta.database.is_closed():
                SimpleTestModel._meta.database.close()

    def test_contains(self):
        try:
            if TestDatabaseSelector.get_database_type()=='sqlite':
                db = self.db_setup_sqlite()
            else:
                db = self.db_setup_postgres()
            
            # Test with array value
            print("\nTesting contains with array element:")
            query = SimpleTestModel.select().where(SimpleTestModel.data.contains(["electronics", "mobile", "dar"]))
            print("DEBUG SQL:", query.sql())
            results = list(query)
            assert len(results)==1

            # Test with simple value
            print("\nTesting contains with simple value:")
            query = SimpleTestModel.select().where(SimpleTestModel.data.contains("dark"))
            print("DEBUG SQL:", query.sql())
            results = list(query)
            assert len(results)==2
            
            print("\nTesting contains with numeric value:")
            query = SimpleTestModel.select().where(SimpleTestModel.data.contains(599.9))
            results = list(query)
            assert len(results)==1
            
        except Exception as e:
            print(f"\n❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            if not db.is_closed():
                db.close()
        
    
    def test_db_value(self):
        try:
            if TestDatabaseSelector.get_database_type()=='sqlite':
                db = self.db_setup_sqlite()
                # Create field instances
                json_field = JSONField()
                
                # Test with string input
                db_value = json_field.db_value(TEST_DATA)
                self.assertEqual(type(db_value), str)
                
                for row in SimpleTestModel.select():
                    self.assertIsInstance(row.data, dict)
                    self.assertIsInstance(row.name, str)  
            else:
                db = self.db_setup_postgres()
                # Create field instances
                json_field = JSONField()
                
                # Test with string input
                db_value = json_field.db_value(TEST_DATA)
                self.assertEqual(type(db_value), Cast)
                
                for row in SimpleTestModel.select():
                    self.assertIsInstance(row.data, dict)
                    self.assertIsInstance(row.name, str)
            
        except Exception as e:
            print(f"\n❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            if not db.is_closed():
                db.close()
 
    def test_python_value(self,):
        try:
            if TestDatabaseSelector.get_database_type()=='sqlite':
                db = self.db_setup_sqlite()
            else:
                db = self.db_setup_postgres()
            # Create field instances
            json_field = JSONField()
            json_str=json.dumps(TEST_DATA)
            # Test with string input
            python_value = json_field.python_value(json_str)
            self.assertEqual(type(python_value), list)
            
            # Test with invalid JSON
            python_value = json_field.python_value("not valid json")
            self.assertEqual(python_value, "not valid json")  # Should return the input string
            
            # Test with None
            python_value = json_field.python_value(None)
            self.assertIsNone(python_value)

        except Exception as e:
            print(f"\n❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            if not db.is_closed():
                db.close()

if __name__=="__main__":
    success = JSONFieldMixinTestCase()
    success.test_contains()
    success.test_db_value()
    success.test_python_value()
    DatabaseSelector.get_database_type = original_get_database_type
