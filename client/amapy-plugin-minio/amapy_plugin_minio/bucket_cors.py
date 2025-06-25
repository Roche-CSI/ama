from minio import Minio
import subprocess
import tempfile
import os
import logging
import json

logger = logging.getLogger(__name__)

def get_minio_client(credentials):
    """Create a MinIO client from credentials."""
    endpoint = credentials.get('endpoint')
    access_key = credentials.get('access_key')
    secret_key = credentials.get('secret_key')
    secure = credentials.get('secure', False)
    
    if isinstance(secure, str):
        secure = secure.lower() == 'true'
    
    return Minio(
        endpoint,
        access_key=access_key,
        secret_key=secret_key,
        secure=secure
    )

def get_bucket_cors(credentials, bucket_name):
    """Get bucket policy as a substitute for CORS configuration."""
    client = get_minio_client(credentials)
    try:
        policy = client.get_bucket_policy(bucket_name)
        return policy
    except Exception as e:
        logger.error(f"Error getting bucket policy: {e}")
        return None

def set_bucket_cors(credentials, bucket_name, origin_url):
    """Set bucket policy to allow public read access, which helps with CORS."""
    client = get_minio_client(credentials)
    
    try:
        # Check if bucket exists, create if it doesn't
        if not client.bucket_exists(bucket_name):
            client.make_bucket(bucket_name)
            logger.info(f"Created bucket: {bucket_name}")
        
        # Create a policy that allows public read access
        # This is a simplified policy that allows anyone to read objects
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                }
            ]
        }

        
        
        # Set the policy
        client.set_bucket_policy(bucket_name, json.dumps(policy))
        logger.info(f"Updated policy for bucket {bucket_name} to allow public access")
        
        return True
        
    except Exception as e:
        logger.error(f"Error updating bucket policy: {e}")
        raise