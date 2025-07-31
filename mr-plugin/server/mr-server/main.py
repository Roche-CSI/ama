from mr_core.configs import Configs
from app import create_app
import os
import sys
from run_gunicorn import StandaloneApplication

# MOUNT_DIR = "/cert"
# HTTPS = False
DEBUG = True
PORT = 5000
HOST = "0.0.0.0"


def get_app(*args):
    Configs.shared()  # default is DEV
    return create_app()


if __name__ == '__main__':
    protocol = sys.argv[1] if len(sys.argv) > 1 else "http"
    if protocol not in ["http", "https"]:
        raise Exception("invalid protocol, use http or https")

    app = get_app()

    # if protocol == "https":
    #     app.run(ssl_context=(os.path.join(MOUNT_DIR, CERT), os.path.join(MOUNT_DIR, KEY)),
    #             host=HOST,
    #             port=PORT,
    #             debug=DEBUG)
    # else:
    #     app.run(host=HOST,
    #             port=PORT,
    #             debug=DEBUG)

    options = {
        'bind': '%s:%s' % (HOST, PORT),
        'workers': 2,
    }
    if protocol == "https":
        options["certfile"] = os.environ.get('SSL_CERT')  # os.path.join(MOUNT_DIR, CERT)
        options["keyfile"] = os.environ.get('SSL_KEY')  # os.path.join(MOUNT_DIR, KEY)

    print("running on: {}".format(protocol))
    StandaloneApplication(app, options).run()