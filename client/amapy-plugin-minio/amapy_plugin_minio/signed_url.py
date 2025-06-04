# amapy_plugin_minio/signed_url.py
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

def create_presigned_url(credentials, bucket_name, object_name, expiry=3600):
    """
    Generate a presigned URL for a MinIO object.
    
    Args:
        credentials (dict): MinIO credentials
        bucket_name (str): Name of the bucket
        object_name (str): Name of the object
        expiry (int): Expiry time in seconds
        
    Returns:
        str: Presigned URL
    """
    from amapy_plugin_minio.bucket_cors import get_minio_client
    
    try:
        client = get_minio_client(credentials)
        return client.presigned_get_object(
            bucket_name,
            object_name,
            expires=timedelta(seconds=expiry)
        )
    
    except Exception as e:
        logger.error(f"Error generating presigned URL: {e}")
        raise