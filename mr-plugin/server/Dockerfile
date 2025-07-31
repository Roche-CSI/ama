# python runtime
FROM python:3.8
ENV DEBIAN_FRONTEND=noninteractive

# copy current directory into the container
WORKDIR /app
ADD . /app

# install requirements
RUN pip install -r /app/asset-server/requirements.txt
# install plugins # todo: make conda packages of server-plugins
RUN cd /app/asset-pluggy && python setup.py develop
RUN cd /app/asset-plugin-gcs && python setup.py develop
RUN cd /app/asset-plugin-posix && python setup.py develop
RUN cd /app/asset-plugin-s3 && python setup.py develop
RUN cd /app/mr-core && python setup.py develop
