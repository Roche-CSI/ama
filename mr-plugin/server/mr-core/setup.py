from setuptools import setup

# setup(
#     name='asset-manager',
#     version='1.0.0',
#     packages=find_packages(include=['src', 'src.*'], exclude=['tests', "tests.*"]),
#     include_package_data=True,
#     install_requires=[
#         'python-dotenv==0.17.0',
#         'pytest==6.2.3',
#         'google_auth_oauthlib==0.4.4',
#         'google-auth==1.30.0',
#         'PyYAML~=5.4.1',
#         # 'dvc==2.1.0',
#         # 'boto3==1.17.79',
#         'google-cloud-storage==1.38.0',
#         'colorama',
#         'tabulate',
#         'aiofiles',
#         'aiohttp',
#         'backoff',
#         'future',
#         'gcloud-aio-auth',
#         'gcloud-aio-storage',
#         'gcloud-rest-auth',
#         'gcloud-rest-storage',
#         'tqdm'
#
#     ],
#     entry_points={
#         'console_scripts': [
#             'asset=src.app:run',
#             'asset-manager=src.asset_mgr:run'
#         ]
#     }
#
# )

if __name__ == '__main__':
    setup()  # use setup.cfg
