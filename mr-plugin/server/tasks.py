import os
import shutil
from io import StringIO
from tempfile import NamedTemporaryFile

from invoke import task

VIEWS_INIT_FILE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                                    "mr-core", "mr_core", "views", "admin_views", "__init__.py")
INDEX_FILE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                               "mr-core", "mr_core", "templates", "admin", "index.html")
CONFIGS_FILE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                               "mr-core", "mr_core", "configs", "configs.py")


def update_index_lines(file):
    replacements = {
        '        '
        '<h1 class="page_title">Asset Manager</h1>\n': '        '
                                                       '<h1 class="page_title">Asset Manager - Sandbox: 5001</h1>\n',
        '        '
        '<h4 class="page_title">Admin Console</h4>\n': '        '
                                                       '<h4 class="page_title">Sandbox Admin Console</h4>\n'
    }
    for line in file:
        yield replacements.get(line, line)


def update_init_lines(file):
    replacements = {
        '                              '
        'name="model registry server",\n': '                              '
                                  'name="asset server sandbox",\n'
    }
    for line in file:
        yield replacements.get(line, line)


@task
def update_for_user_test(c):
    if os.path.isfile(INDEX_FILE_PATH):
        with open(INDEX_FILE_PATH, "r") as file, NamedTemporaryFile("w", delete=False) as tmp_file:
            for new_line in update_index_lines(file):
                tmp_file.write(new_line)
        shutil.move(tmp_file.name, INDEX_FILE_PATH)
        print(f"Completed file update. {INDEX_FILE_PATH}")
        with open(INDEX_FILE_PATH, "r") as file:
            print(f"Index file: \n{file.read()}")
    else:
        raise (ValueError(str(f"Unable to locate index.html at: {INDEX_FILE_PATH}")))
    if os.path.isfile(VIEWS_INIT_FILE_PATH):
        with open(VIEWS_INIT_FILE_PATH, "r") as file, NamedTemporaryFile("w", delete=False) as tmp_file:
            for new_line in update_init_lines(file):
                tmp_file.write(new_line)
        shutil.move(tmp_file.name, VIEWS_INIT_FILE_PATH)
        print(f"Completed file update. {VIEWS_INIT_FILE_PATH}")
        with open(VIEWS_INIT_FILE_PATH, "r") as file:
            print(f"Init file: \n{file.read()}")
    else:
        raise (ValueError(str(f"Unable to locate __init__.py at: {VIEWS_INIT_FILE_PATH}")))


def update_config_user_test(file):
    replacements = {
        "DEFAULT_MODE = ConfigModes.PRODUCTION\n": "DEFAULT_MODE = ConfigModes.USER_TEST\n",
        "DEFAULT_MODE = ConfigModes.USER_TEST\n": "DEFAULT_MODE = ConfigModes.USER_TEST\n"
    }
    for line in file:
        yield replacements.get(line, line)


def update_config_production(file):
    replacements = {
        "DEFAULT_MODE = ConfigModes.PRODUCTION\n": "DEFAULT_MODE = ConfigModes.PRODUCTION\n",
        "DEFAULT_MODE = ConfigModes.USER_TEST\n": "DEFAULT_MODE = ConfigModes.PRODUCTION\n"
    }
    for line in file:
        yield replacements.get(line, line)


@task
def update_config(c, branch):
    if branch == "sandbox":
        if os.path.isfile(CONFIGS_FILE_PATH):
            with open(CONFIGS_FILE_PATH, "r") as file, NamedTemporaryFile("w", delete=False) as tmp_file:
                for new_line in update_config_user_test(file):
                    tmp_file.write(new_line)
            shutil.move(tmp_file.name, CONFIGS_FILE_PATH)
            print(f"Completed file update. {CONFIGS_FILE_PATH}")
        else:
            raise (ValueError(str(f"Unable to locate configs.py at: {CONFIGS_FILE_PATH}")))
    elif branch == "master":
        if os.path.isfile(CONFIGS_FILE_PATH):
            with open(CONFIGS_FILE_PATH, "r") as file, NamedTemporaryFile("w", delete=False) as tmp_file:
                for new_line in update_config_production(file):
                    tmp_file.write(new_line)
            shutil.move(tmp_file.name, CONFIGS_FILE_PATH)
            print(f"Completed file update. {CONFIGS_FILE_PATH}")
        else:
            raise (ValueError(str(f"Unable to locate configs.py at: {CONFIGS_FILE_PATH}")))
    else:
        raise ValueError(str("Deployment should be initiated from sandbox or master branch only."))


@task(name="check_repo")
def check_repo(c, branch="sandbox"):
    print(f"Inside check_repo, and checking out branch: {branch}")
    c.run(f"git checkout {branch}")


@task(name="verify_running_state")
def verify_running_state(c, image="ubuntu"):
    print(f"Inside function verify_running_state, searching for container running with image {image}")
    response = c.run('docker ps -a --filter name=' + image + ' --format {{.ID}}')
    return response.stdout


@task(name="stop_container")
def stop_container(c, id=None):
    if not id:
        print("Please pass container ID")
    else:
        print(f"Inside function stop_container, stopping contianer {id}")
        response = c.run(f"docker stop {id}")
        if response.exited != 0:
            print(f"Stopping Contianer {id} failed.")


@task(name="delete_container")
def delete_container(c, id=None):
    if not id:
        print("Please pass container ID")
    else:
        print(f"Inside function delete_container, deleting contianer {id}")
        response = c.run(f"docker rm {id}")
        if response.exited != 0:
            print(f"Deleting Contianer {id} failed.")


@task(name="stop_running_containers")
def stop_running_containers(c, image="ubuntu"):
    print(f"Inside stop_running_containers, stopping containers running: {image}")
    container_ids = verify_running_state(c, image=image)
    for container_id in StringIO(container_ids):
        stop_container(c, id=container_id)
        delete_container(c, id=container_id)
    container_ids = verify_running_state(c, image=image)
    if len(container_ids) != 0:
        print("Failed to stop all containers.")
    else:
        print(f"No containers with {image} running.")


@task
def build_cleanup(c):
    print("This is cleanup placeholder.")


@task
def build_image(c, image="mr-user-testing", tag="latest"):
    build_cleanup(c)
    c.run(f"docker build -t {image}:{tag} .")


@task(name="run_container")
def run_container(c, image=None, tag="latest", host_certs_path="/cert", mount_certs_path="/cert",
                  host_port="0.0.0.0:5001", container_port="5000", protocol="https",
                  key_file="key-file.key",
                  cert_file="cert-file.crt"):
    if not image:
        print("Pass the image ID to run.")
    else:
        print(f"Inside run_container, starting containers with image: {image}:{tag} at {host_port}")
        c.run(f"set -x && docker run --detach \
                            --mount type=bind,source={host_certs_path},target={mount_certs_path} \
                            --env SSL_KEY={mount_certs_path}/{key_file} \
                            --env SSL_CERT={mount_certs_path}/{cert_file} \
                            --publish '{host_port}':{container_port} --name={image}\
                            {image}:{tag} python3 /app/asset-server/main.py {protocol}")


# asset-server-user-testing:latest 0.0.0.0:5001->5000/tcp
# asset-server-production:latest 0.0.0.0:5000->5000/tcp


@task
def build_deploy_user_testing(c, image="mr-user-testing", tag="latest"):
    container_ids = verify_running_state(c, image)

    build_image(c, image=image, tag=tag)

    for container_id in StringIO(container_ids):
        stop_container(c, id=container_id)
        delete_container(c, id=container_id)
    container_ids = verify_running_state(c, image)
    if len(container_ids) != 0:
        print("Failed to stop all containers.")
    else:
        print(f"No containers with {image} running.")

    run_container(c, image, tag, host_port="0.0.0.0:5001")

    print(f"Checking for {image}. Below are the containers found.")
    container_ids = verify_running_state(c, image)
    for container_id in StringIO(container_ids):
        print(container_id)
    if len(container_ids) == 0:
        print(f"No containers with {image} running.")


@task
def build_deploy_production(c, image="mr-production", tag="latest"):
    container_ids = verify_running_state(c, image)

    build_image(c, image=image, tag=tag)

    for container_id in StringIO(container_ids):
        stop_container(c, id=container_id)
        delete_container(c, id=container_id)
    container_ids = verify_running_state(c, image)
    if len(container_ids) != 0:
        print("Failed to stop all containers.")
    else:
        print(f"No containers with {image} running.")

    run_container(c, image, tag, host_port="0.0.0.0:5000")

    print(f"Checking for {image}. Below are the containers found.")
    container_ids = verify_running_state(c, image)
    for container_id in StringIO(container_ids):
        print(container_id)
    if len(container_ids) == 0:
        print(f"No containers with {image} running.")
