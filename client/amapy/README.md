# amapy

The client side tool for ama project. It provides a command-line
interface and a Python API for programmatic access to manage and distribute
digital assets.

## Installation

The source code is currently hosted on GitHub at:
https://github.com/Roche-CSI/ama

Binary installers for the latest released version are available at the
[Python Package Index (PyPI)](https://pypi.org/project/amapy/)

You can install using [pip](https://pip.pypa.io/en/stable/):

```sh
pip install amapy
```

## Usage

### Command Line Interface

```sh
ama --help
```

### Python API

```python
from amapy import asset

asset.auth.login()
```

## Supported Python Versions

Python == 3.10

## License

MIT License - see [LICENSE](https://github.com/Roche-CSI/ama/blob/main/LICENSE) for details.
