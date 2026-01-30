import logging
import os
import pathlib
import random
import re
import shutil
import string
import subprocess

import pytest

configurations = {
    "production": {
        "TOKEN":"replace.your.jwt.token.here",
        "PROJECT": "test_project_001",
        "SAMPLE_ASSET_CLASS_NAME": "test_asset_class_001",
        "SAMPLE_ASSET": "test_asset_class_001/1/0.0.0",
        "SAMPLE_ASSET_FILE": "file1.txt",
        "SAMPLE_ASSET_DELETED_FILE": "file2.txt",
        "SAMPLE_ASSET_HASH": "xxxxaxxxxaxxxxaxxxxaxxxxaxxxxaxx",
        "ASSET_DNS": "127.0.0.1:3000",
        "COMMIT_MESSAGE": "Test Asset Manager"
    }
}

ASSET_ENVIRONMENT = os.environ.get("ASSET_ENVIRONMENT", None)

if ASSET_ENVIRONMENT is None:
    raise RuntimeError(f"Environment information not found, "
                       f"\nplease set `ASSET_ENVIRONMENT` to `production` or `sandbox`.")

active_config = configurations.get(ASSET_ENVIRONMENT.lower(), None)

if active_config is None:
    raise RuntimeError(f"Unable to set configurations, error with environment {ASSET_ENVIRONMENT}")

TOKEN = active_config["TOKEN"]
PROJECT = active_config["PROJECT"]
SAMPLE_ASSET_CLASS_NAME = active_config["SAMPLE_ASSET_CLASS_NAME"]
SAMPLE_ASSET = active_config["SAMPLE_ASSET"]
SAMPLE_ASSET_HASH = active_config["SAMPLE_ASSET_HASH"]
SAMPLE_ASSET_FILE = active_config["SAMPLE_ASSET_FILE"]
SAMPLE_ASSET_DELETED_FILE = active_config["SAMPLE_ASSET_DELETED_FILE"]
ASSET_DNS = active_config["ASSET_DNS"]
COMMIT_MESSAGE = active_config["COMMIT_MESSAGE"]

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] [%(filename)s:%(lineno)d] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class Helper:

    @classmethod
    def file_generator(cls, file_path, length=250) -> bool:
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
            letters = string.ascii_letters + string.digits + string.punctuation
            text = ''.join(random.choice(letters) for i in range(length))
            with open(file_path, 'w') as f:
                f.write(text)
            return True if os.path.isfile(file_path) else False
        except Exception as e:
            logging.error(f"Error occurred while generating file. \n{str(e)}")
            raise

    @classmethod
    def execute(cls,
                cmd: str,
                check=True,
                cwd=None,
                env=None,
                log=True,
                shell=False,
                stderr=subprocess.PIPE,
                stdout=subprocess.PIPE,
                text=True) -> str:
        """Execute the CLI commands in the host OS"""
        try:
            if cwd is None:
                cwd = os.getcwd()
            if env is None:
                env = dict(os.environ)
            # add the asset environment to cmd
            # cmd = f"conda run -n {ASSET_ENV} {cmd}"
            logging.debug(f"Running command: {cmd}")
            output = subprocess.run(args=cmd.split(),
                                    check=check,
                                    cwd=cwd,
                                    env=env,
                                    shell=shell,
                                    stderr=stderr,
                                    stdout=stdout,
                                    text=text)
            out = output.stdout
            err = output.stderr
            if err:
                logging.debug(f"Errors or warning found: \n{err}")
            if log:
                logging.debug(f"Output:\n{out}")
            return out.strip()
        except Exception as e:
            logging.debug(f"Error in executing the command: {cmd}. \n"
                          f"Error: \n{str(e)}")
            raise


class AssetTestBase:
    def __init__(self):
        self.helper = Helper()
        self.path = os.path.join(os.getcwd(), 'workspace')
        self.cleanup()
        self.setup_auth_and_project()
        os.makedirs(os.path.join(os.getcwd(), 'workspace'), exist_ok=True)

    def setup_auth_and_project(self):
        """Run the common setup commands for authentication and project activation."""
        self.helper.execute(cmd=f"ama auth logout")
        self.helper.execute(cmd=f"ama store clear")
        self.helper.execute(cmd=f"ama auth login --token {TOKEN}")
        self.helper.execute(cmd=f"ama project activate {PROJECT}")
        self.helper.execute(cmd=f"ama class fetch")

    def run_test(self):
        """Method to be overridden by subclasses to run specific test commands."""
        raise NotImplementedError("Subclasses should implement this method")

    def cleanup(self):
        """
        Cleanup the files created by AMA
        Can be overridden by subclasses to do specific cleanup operations
        """
        self.helper.execute(cmd=f"ama auth logout")
        self.helper.execute(cmd=f"ama store clear")
        if os.path.exists(self.path):
            shutil.rmtree(self.path)

    def fetch_assets(self) -> None:
        """Download some test assets for validations"""
        self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                            cwd=self.path)

    def fetch_asset_hash(self) -> str:
        """Download some test assets for validations"""
        output = self.helper.execute(cmd=f"ama info --hash",
                                     cwd=self.path)
        return output.strip()

    def fetch_asset_info_name(self) -> str:
        """Download some test assets for validations"""
        output = self.helper.execute(cmd=f"ama info --name",
                                     cwd=self.path)
        return output.strip()

    def fetch_asset_status(self) -> str:
        """Download some test assets for validations"""
        output = self.helper.execute(cmd=f"ama status",
                                     cwd=self.path)
        return output.strip()

    def upload_asset(self) -> str:
        """Download some test assets for validations"""
        output = self.helper.execute(cmd=f"ama upload -m {COMMIT_MESSAGE}",
                                     cwd=self.path)
        return output.strip()

    def fetch_sample_asset(self) -> str:
        """Download the sample asset"""
        output = self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                                     cwd=self.path)
        return output.strip()


@pytest.fixture(scope="function")
def asset_test_base():
    """Pytest fixture for common setup."""
    base = AssetTestBase()
    yield base
    base.cleanup()

class CloneAssets(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                            cwd=self.path)
        asset_hash = self.fetch_asset_hash()
        assert asset_hash == SAMPLE_ASSET_HASH


def test_clone_assets(asset_test_base):
    """Test hash value after cloning assets."""
    clone_assets = CloneAssets()
    clone_assets.run_test()


class ListProjects(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama project list", cwd=self.path)


def test_list_projects(asset_test_base):
    """Test the projects listed for the user."""
    list_projects = ListProjects()
    list_projects.run_test()


class ValidateAssetHash(AssetTestBase):
    def run_test(self):
        self.fetch_assets()
        output = self.helper.execute(cmd=f"ama info --hash", cwd=self.path)
        assert output == SAMPLE_ASSET_HASH


def test_asset_hash(asset_test_base):
    """Test the asset hash capability."""
    validate_asset_hash = ValidateAssetHash()
    validate_asset_hash.run_test()


class ValidateAuthInfo(AssetTestBase):
    def run_test(self):
        output = self.helper.execute(cmd=f"ama auth info", cwd=self.path)
        assert "john" in output and "john.doe@gmail.com" in output


def test_auth_info(asset_test_base):
    """Test the auth info generated."""
    auth_info = ValidateAuthInfo()
    auth_info.run_test()


class ValidateAuthLogout(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama auth logout", cwd=self.path)
        output = self.helper.execute(cmd=f"ama auth info", cwd=self.path)
        assert "you are not signed in" in output


def test_auth_logout(asset_test_base):
    """Test the logout functionality"""
    auth_logout = ValidateAuthLogout()
    auth_logout.run_test()


class ValidateAssetCreation(AssetTestBase):
    def run_test(self):
        self.fetch_sample_asset()
        self.helper.file_generator(file_path=os.path.join(self.path, "new-asset.log"))
        output = self.helper.execute(cmd=f"ama add new-asset.log --yes", cwd=self.path)
        assert "added 1 new files" in output
        self.upload_asset()
        output = self.fetch_asset_info_name()
        pattern = fr'^{SAMPLE_ASSET_CLASS_NAME}/\d+/\d+.\d+.\d+'
        assert bool(re.fullmatch(pattern, output))


def test_asset_creation(asset_test_base):
    """Test asset creation and push to remote"""
    asset_creation = ValidateAssetCreation()
    asset_creation.run_test()


class ValidateAssetInfoWithoutUpload(AssetTestBase):
    def run_test(self):
        self.fetch_sample_asset()
        file_name = "new-asset-no-upload.log"
        self.helper.file_generator(file_path=os.path.join(self.path, file_name))
        assert os.path.isfile(os.path.join(self.path, file_name))
        output = self.helper.execute(cmd=f"ama add {file_name} --yes", cwd=self.path)
        assert "adding files" in output
        output = self.fetch_asset_status()
        assert "Changes to be committed" in output
        output = self.fetch_asset_info_name()
        assert SAMPLE_ASSET in output


def test_asset_info_name(asset_test_base):
    """Test asset info name generation"""
    asset_info = ValidateAssetInfoWithoutUpload()
    asset_info.run_test()


class ValidateAssetURL(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                            cwd=self.path)
        output = self.helper.execute(cmd=f"ama info --url {SAMPLE_ASSET_FILE}",
                                     cwd=self.path)
        pattern = fr'^https://{re.escape(ASSET_DNS)}/asset/[\d\w]+-[\d\w]+-[\d\w]+-[\d\w]+-[\d\w]+'
        assert bool(re.search(pattern, output))


def test_asset_url(asset_test_base):
    """Test asset URL generation"""
    asset_url = ValidateAssetURL()
    asset_url.run_test()


class ValidateAssetStatus(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                            cwd=self.path)
        output = self.helper.execute(cmd=f"ama status", cwd=self.path)
        assert 'asset is clean' in output and 'there are no changes' in output


def test_asset_status(asset_test_base):
    """Test asset status generated"""
    asset_status = ValidateAssetStatus()
    asset_status.run_test()


class ValidateAssetRemoval(AssetTestBase):
    def run_test(self):
        self.helper.execute(cmd=f"ama clone {SAMPLE_ASSET} --dir .",
                            cwd=self.path)
        self.helper.execute(cmd=f"ama remove {SAMPLE_ASSET_FILE} --yes", cwd=self.path)
        output = self.helper.execute(cmd=f"ama status", cwd=self.path)
        assert 'Changes to be committed' in output and 'removed' in output
        output = self.upload_asset()
        assert 'asset upload complete' in output
        # output = self.helper.execute(cmd=f"ama status", cwd=self.path)
        # assert f'asset: {SAMPLE_ASSET_CLASS_NAME}' in output


def test_asset_removal(asset_test_base):
    """Test removal of asset from an asset class"""
    asset_removal = ValidateAssetRemoval()
    asset_removal.run_test()


class ValidateAssetVersionSwitch(AssetTestBase):
    def run_test(self):
        self.fetch_sample_asset()
        assert os.path.isfile(os.path.join(self.path, SAMPLE_ASSET_DELETED_FILE))
        os.remove(os.path.join(self.path, SAMPLE_ASSET_DELETED_FILE))
        # fetch asset versions before switching
        self.helper.execute(cmd=f"ama fetch", cwd=self.path)
        output = self.helper.execute(cmd=f"ama switch --version 0.0.1", cwd=self.path)
        assert 'version: 0.0.1 is now active' in output
        assert not os.path.isfile(os.path.join(self.path, SAMPLE_ASSET_DELETED_FILE))


def test_asset_version_switch(asset_test_base):
    """Test asset version switch"""
    asset_switch = ValidateAssetVersionSwitch()
    asset_switch.run_test()


class ValidateAssetAlias(AssetTestBase):
    def run_test(self):
        self.fetch_sample_asset()
        alias = "my_alias"
        self.helper.execute(cmd=f"ama alias add {alias}",
                            cwd=self.path)
        self.upload_asset()
        output = self.helper.execute(cmd=f"ama alias info",
                                     cwd=self.path)
        assert alias in output
        # Remove the alias
        output = self.helper.execute(cmd=f"ama alias remove",
                                     cwd=self.path)
        assert "alias removed" in output
        output = self.helper.execute(cmd=f"ama alias info",
                                     cwd=self.path)
        assert "None" in output
        # Add a new alias
        alias = "new_alias"
        self.helper.execute(cmd=f"ama alias add {alias}",
                            cwd=self.path)
        self.upload_asset()
        output = self.helper.execute(cmd=f"ama alias info",
                                     cwd=self.path)
        assert alias in output


def test_asset_alias_addition(asset_test_base):
    """Test asset alias addition"""
    asset_alias = ValidateAssetAlias()
    asset_alias.run_test()