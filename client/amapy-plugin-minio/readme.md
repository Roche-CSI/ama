How to use Minio locally.

1. Download the MinIO binary:
```
wget https://dl.min.io/server/minio/release/linux-amd64/minio

chmod +x minio
```

2. Start the MinIO server:
```
./minio server /data --console-address ":9001"
```


Access the MinIO Console at http://localhost:9001

Login with:
```
Username: minioadmin
Password: minioadmin
```
Create the required bucket:
Click "Create Bucket"
Enter project-bucket as the bucket name
Click "Create Bucket"

Creating a Project with MinIO Storage
Using the API
Make a POST request to create a project with MinIO storage:

```
curl -X POST http://127.0.0.1:5000/db/project \
  -H "Content-Type: application/json" \
  -d '{
    "name": "minio_project",
    "is_active": true,
    "staging_url": "",
    "credentials_server": {
        "endpoint": "localhost:9000",
        "access_key": "minioadmin",
        "secret_key": "minioadmin",
        "secure": false
    },
    "remote_url": "minio://project-bucket",
    "credentials_user": {
        "endpoint": "localhost:9000",
        "access_key": "minioadmin",
        "secret_key": "minioadmin",
        "secure": false
    },
    "readme": "Project using MinIO for local storage",
    "description": "Test project using MinIO storage",
    "title": "MinIO Test Project",
    "status": 1
}'
```