# Using MinIO with AMA: Local and Cloud Deployment Guide

MinIO provides a lightweight, S3-compatible object storage solution that can be deployed both locally for development and on cloud infrastructure for production environments. This document explains how to set up and use MinIO with AMA in both scenarios.

## Local MinIO Setup

### Prerequisites
- Linux/macOS system
- Sufficient disk space for your data

### Installation Steps

1. **Download MinIO Server**
   ```bash
   wget https://dl.min.io/server/minio/release/linux-amd64/minio
   chmod +x minio
   ```

2. **Start MinIO Server**
   ```bash
   ./minio server /data --console-address ":9001"
   ```
   This starts MinIO with data stored in the `/data` directory and the web console available at port 9001.

3. **Access the MinIO Console**
   - Open your browser and navigate to http://localhost:9001
   - Default credentials:
     - Username: `minioadmin`
     - Password: `minioadmin`

4. **Create a Bucket**
   - In the console, enter `project-bucket` as the bucket name
   - Click "Create Bucket"

### Configuring AMA with Local MinIO

#### Using the API
```bash
curl -X POST http://127.0.0.1:5000/db/project \
  -H "Content-Type: application/json" \
  -d '{
    "name": "movie_collection",
    "is_active": true,
    "staging_url": "",
    "credentials_server": {
        "endpoint": "localhost:9000",
        "access_key": "minioadmin",
        "secret_key": "minioadmin",
        "secure": false
    },
    "remote_url": "minio://movie-collection",
    "credentials_user": {
        "endpoint": "localhost:9000",
        "access_key": "minioadmin",
        "secret_key": "minioadmin",
        "secure": false
    },
    "readme": "Uses Minio Storage.",
    "description": "MinIO storage.",
    "title": "Movie Collection",
    "status": 1
}'
```


## Cloud MinIO Deployment

### Option 1: Self-Hosted on Cloud VM. **Provision a VM** on your preferred cloud provider (AWS EC2, Azure VM, GCP Compute Engine, etc.)

2. **Install MinIO** on the VM:
   ```bash
   wget https://dl.min.io/server/minio/release/linux-amd64/minio
   chmod +x minio
   ```

3. **Configure Persistent Storage**
   ```bash
   mkdir /minio-data
   ```

4. **Create a SystemD Service** for automatic startup
   Create file `/etc/systemd/system/minio.service`:
   ```
   [Unit]
   Description=MinIO
   Documentation=https://docs.min.io
   Wants=network-online.target
   After=network-online.target

   [Service]
   User=minio
   Group=minio
   ExecStart=/path/to/minio server /minio-data --console-address 
   Restart=always
   LimitNOFILE=65536
   TimeoutStopSec=infinity
   SendSIGKILL=no

   [Install]
   WantedBy=multi-user.target
   ```

5. **Enable and Start the Service**
   ```bash
   systemctl enable minio
   systemctl start minio
   ```. **Configure Firewall** to allow ports 9000 (API) and 9001 (Console)

7. **Set Up Security**
   - Change default credentials
   - Set up TLS/SSL for secure connections


### Configuring AMA with Cloud MinIO

```bash
curl -X POST http://ama-server:5000/db/project \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cloud_minio_project",
    "is_active": true,
    "credentials_server": {
        "endpoint": "minio-server.cloud:9000",
        "access_key": "access-key",
        "secret_key": "secret-key",
        "secure": true
    },
    "remote_url": "minio://minio-bucket",
    "credentials_user": {
        "endpoint": "minio-server.cloud:9000",
        "access_key": "access-key",
        "secret_key": "secret-key",
        "secure": true
    },
    "readme": "Project using cloud MinIO storage",
    "description": "Production project using MinIO storage",
    "title": "Cloud MinIO Project",
    "status": 1
}'
```

## Best Practices for Production Use

1. **Security**
   - Never use default credentials in production
   - Enable TLS/SSL (set `secure: true` in credentials)
   - Implement proper IAM policies and access controls
   - Use separate access keys for different applications

2. **Performance**
   - Use distributed MinIO deployment for high availability
   - Configure proper erasure coding for data durability
   - Monitor performance metrics

3. **Backup and Recovery**
   - Set up regular backups of your MinIO data
   - Test recovery procedures
   - Configure bucket versioning for critical data

4. **Monitoring**
   - Set up alerts for storage capacity
   - Monitor API usage and latency
   - Configure logging for troubleshooting
