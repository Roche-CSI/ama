import os
import random
import time
from concurrent.futures import ProcessPoolExecutor
from contextlib import contextmanager

from amapy.python_api import asset
from amapy_utils.common.exceptions import NoActiveProjectError

asset.disable_logging()


def get_active_asset_project() -> str | None:
    try:
        return asset.project.active["name"]
    except NoActiveProjectError:
        return None


@contextmanager
def switch_asset_project(asset_project_name: str):
    original_active_project_name = get_active_asset_project()
    try:
        # Switch to the new active project.
        asset.project.activate(project_name=asset_project_name)
        yield
    finally:
        # Switch back to the original active project.
        asset.project.activate(project_name=original_active_project_name)


def switch_assets():
    print(f"Before switch: {get_active_asset_project()}")
    with switch_asset_project("acap_production"):
        print(f"Switched: {get_active_asset_project()}")
        time.sleep(random.uniform(0.0, 2.0))
    print(f"After switch: {get_active_asset_project()}")


def main():
    num_workers = os.cpu_count()
    asset.project.activate(project_name="rss_data_science")
    results = {}
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        for i in range(num_workers):
            job = executor.submit(switch_assets)
            results[i] = job


if __name__ == '__main__':
    main()
