from mr_core.configs import Configs
from mr_core.app import create_app

def run():
    Configs.shared()  # default is DEV
    create_app().run(debug=True, port=5001)


if __name__ == '__main__':
    run()