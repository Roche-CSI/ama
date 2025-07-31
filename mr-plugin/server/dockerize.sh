#!/bin/bash

IMAGE_NAME="docker-image-name"
HOST_PORT_HTTP=0.0.0.0:80
#HOST_PORT_HTTPS=0.0.0.0:443
HOST_PORT_HTTPS=0.0.0.0:5001 # change port to 5000 for deploying to production
CONTAINER_PORT=5000
HOST_CERTS_PATH="/cert"
MOUNT_CERTS_PATH="/cert"
MOUNT_GCP_JSON="/app/key.json"
DEFAULT_GCP_JSON="credentials-path"
KEY_FILE="key-file"
CERT_FILE="cert-file"

function build_image() {
  docker build -t $IMAGE_NAME -f ./Dockerfile .
}

function run_image() {
  # google application credentials
  GCP_JSON=$1

  if [ "${GCP_JSON}" == "http" ] || [ "${GCP_JSON}" == "https" ]
  then
    PROTOCOL=$1
    unset GCP_JSON
  fi

  if [ -z "${GCP_JSON}" ]
  then
    GCP_JSON=$DEFAULT_GCP_JSON
    echo "using default gcp credentials at: ${GCP_JSON}"
  else
    echo "using gcp credentials at: ${GCP_JSON}"
  fi

  # check http or https
  if [ -z "${PROTOCOL}" ]; then
    PROTOCOL=$2
  fi

  if [ "${PROTOCOL}" == "http" ]
  then
    HOST_PORT=$HOST_PORT_HTTP
    echo "running on http at: ${HOST_PORT}"
  else
    HOST_PORT=$HOST_PORT_HTTPS
    echo "running on https at: ${HOST_PORT}"
  fi

  echo "running docker image..."

  docker run \
  --mount type=bind,source="${HOST_CERTS_PATH}",target="${MOUNT_CERTS_PATH}" \
  --mount type=bind,source="${GCP_JSON}",target="${MOUNT_GCP_JSON}" \
  --detach \
  --env GOOGLE_APPLICATION_CREDENTIALS="${MOUNT_GCP_JSON}" \
  --env SSL_KEY="${MOUNT_CERTS_PATH}/${KEY_FILE}" \
  --env SSL_CERT="${MOUNT_CERTS_PATH}/${CERT_FILE}" \
  --publish $HOST_PORT:$CONTAINER_PORT "${IMAGE_NAME}:latest" python3 /app/asset-server/main.py "${PROTOCOL}"

#  docker run \
#  --detach \
#  --env GOOGLE_APPLICATION_CREDENTIALS="${MOUNT_GCP_JSON}" \
#  --publish $HOST_PORT:$CONTAINER_PORT "${IMAGE_NAME}:latest" python3 /app/asset-server/main.py
}

ACTION=$1

if [[ $ACTION == "build" ]]; then
  echo "building docker image..."
  build_image
elif [[ $ACTION == "run" ]]; then
  run_image "$2" "$3"
else
  echo "unknown command"
fi