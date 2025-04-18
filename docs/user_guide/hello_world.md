# Hello AMA

## Hands-on with AMA

Here we will walk you through the basic commands of AMA. We will be using the command-line interface as it
is the primary way to interact with AMA. You don't need to know anything about assets, asset-classes, or
asset-projects to get started. We will try to explain them as we go along. So let's get started!

### Setting up the environment

- In python 3.10 environment:
  - `pip install amapy`

### Signing up / logging in

- We will be using the `ama auth` sub-command for signing / logging purposes.
- If you are a new user, you need to sign up for amapy. Use the following command with your organization's `username` and
  `email address` to sign up:
- `ama auth signup -u <username> -e <email_address>`
- If you are an existing user, you can just log in using the following command:
- `ama auth login` : using google authentication
- To log out, you can use the following command:
- `ama auth logout`
- after successful login, you will see a `Success` message and the list of projects you have access to.

```bash
Success
Signed in as: <username>
#         Project Name       ID                                    Remote-URL
--------  -----------------  ------------------------------------  --------------------------------------------------------------------------------
0 active  ML-Model-Training   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  gs://ml-training-artifacts/models/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/commit
1         Customer-Analytics  7xxxxxx9-dxx6-4xx0-9xxe-fxxxxxxxx4c1  gs://analytics-data-lake/customer-insights
(use: ama project activate <project_name> --> to activate a project)
```

### Setting up the project

- By default, all new users will have access to the `ML-Model-Training` project.
- We will be using the `ama project` sub-command to interact with amapy projects.
- `ama project list` : to view the list of projects you have access to

```bash
(ama-env) ~ % ama project list
#         Project Name       ID                                    Remote-URL
--------  -----------------  ------------------------------------  --------------------------------------------------------------------------------
0         ML-Model-Training   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  gs://ml-training-artifacts/models/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/commit
1 active  Customer-Analytics  7xxxxxx9-dxx6-4xx0-9xxe-fxxxxxxxx4c1  gs://analytics-data-lake/customer-insights
(use: ama project activate <project_name> --> to activate a project)
```

- If you see a different active project, you have to activate the `ML-Model-Training` project.
- `ama project activate ML-Model-Training` : to activate `ML-Model-Training`

```bash
(ama-env) ~ % ama project activate ML-Model-Training                        
Success
active project: ML-Model-Training
#         Project Name       ID                                    Remote-URL
--------  -----------------  ------------------------------------  --------------------------------------------------------------------------------
0 active  ML-Model-Training   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  gs://ml-training-artifacts/models/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/commit
1         Customer-Analytics  7xxxxxx9-dxx6-4xx0-9xxe-fxxxxxxxx4c1  gs://analytics-data-lake/customer-insights
```

### Fetching the class list

- To get started, we need to know the asset-classes available in the project.
- `ama class fetch` : to fetch the list of asset-classes available in the project

```bash
(ama-env) ~ % ama class fetch
fetching asset-classes from remote: gs://ml-training-artifacts/models/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/commit/ml-training-classes
downloading asset-class list: 100%|█████████████████████████████████| 32/32 [00:00<00:00, 47.24it/s] done - downloading 32 files took: 0.71 sec
verifying checksum: 100%|████████████████████████████████████████| 32/32 [00:00<00:00, 20394.73it/s] done - verifying 32 files took: 0.00 sec

completed
to view the list of classes: (use: ama class list --> to list all the asset collections)
```

- `ama class list` : to view the list of asset-classes available in the project

```bash
(ama-env) ~ % ama class list
Listing asset-classes
#    Name                         ID                                    Created-By    Created-At
---  --------------------------  ------------------------------------  ------------  -------------------------
1    resource_model_1            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user1          2025/02/15 09:23:47 -0700
2    resource_segment_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/03 14:38:21 -0800
3    resource_data_1             xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/12 11:05:33 -0800
4    resource_dataset_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user3          2025/02/07 16:42:19 -0700
5    resource_embedding_1        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/22 08:17:42 -0700
6    resource_feature_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/10 13:29:56 -0700
7    resource_forecast_1         xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user5          2025/02/05 10:11:38 -0700
8    resource_detection_1        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user6          2025/02/18 15:53:27 -0700
9    resource_store_1            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/02 09:45:12 -0700
10   resource_metric_1           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user5          2025/02/14 11:36:58 -0700
11   resource_log_1              xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/08 14:22:31 -0700
12   resource_pipeline_1         xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/05 16:49:23 -0700
13   resource_campaign_1         xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user7          2025/02/19 08:57:14 -0700
14   resource_catalog_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user3          2025/02/28 13:41:05 -0700
15   resource_analysis_1         xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user3          2025/02/17 15:33:42 -0700
16   resource_test_1             xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user5          2025/02/22 10:28:36 -0700
17   resource_spatial_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/11 17:19:52 -0800
18   resource_event_1            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/20 14:07:18 -0700
19   resource_reading_1          xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user8          2025/02/25 11:52:49 -0700
20   resource_model_2            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user2          2025/02/09 16:38:24 -0700
21   resource_map_1              xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/14 09:26:37 -0700
22   resource_engine_1           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/03 13:45:19 -0700
23   resource_speech_1           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user3          2025/02/27 15:14:53 -0700
24   resource_video_1            xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/16 10:33:28 -0700
25   resource_translation_1      xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user5          2025/02/20 12:21:46 -0700
26   resource_health_1           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  user4          2025/02/11 17:49:32 -0700
(use: ama list --class <class-name> --> to list all the assets in a class)
(use: ama class fetch --> to refresh the asset-classes from remote)
(use: ama list --help --> for more details)
```

### Initializing a new asset

- Now that we know the asset-classes available in the project, let's create a new asset.
- We will create a new asset of class type `trained_models`.
- It's recommended to use a new directory for each asset to keep things organized.
- Let's create a new directory called `my_new_asset` and navigate to it.
- `ama init trained_models` : to initialize a new asset of class type `trained_models`

```bash
(ama-env) ~ % mkdir my_new_asset
(ama-env) ~ % cd my_new_asset 
(ama-env) my_new_asset % ama init trained_models
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|                                          🅰🆂🆂🅴🆃-🅼🅰🅽🅰🅶🅴🆁                                  |
|                       New asset for class 'trained_models' initialized                        |
|                          asset location: /Users/user1/my_new_asset                           |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

### Adding files to the asset

- In the previous section, we have initialized a new asset in the `my_new_asset` directory.
- As the asset directory is currently empty, let's add some files to it.
- You can add any files to the asset by simply copying them to the asset directory.
- Let's create some new files with some content to begin with.

```bash
(ama-env) my_new_asset % echo "Hello World." > hello_world.txt
(ama-env) my_new_asset % echo "AMA is awesome." > my_file.txt
```

- After adding the files, you can check the status of the asset using the following command:
- `ama status` : to check the status of the asset

```bash
(ama-env) my_new_asset % ama status
asset: trained_models/temp_1727989833
version: temp_1727989833

Untracked files:
	(use: ama add <file>... --> to add files, dirs to asset)
		new:   my_file.txt
		new:   hello_world.txt

(use: ama discard --all --> to discard all staged and unstaged changes)
```

- As you can see, both the files `my_file.txt` and `hello_world.txt` are untracked. We need to add them to the asset.
- Also notice the asset name and version has `temp_` prefix. This means it's a local asset and not been uploaded yet.
- Let's add the `hello_world.txt` file to the asset using the following command:
- `ama add hello_world.txt` : to add the `hello_world.txt` file to the asset

```bash
(ama-env) my_new_asset % ama add hello_world.txt
target: ['hello_world.txt']
collecting source information: ... done
this will add 1 files to the asset, do you wish to continue? options: (y/n), default: [y]: y
creating objects: 100%|██████████████████████████████████████████████| 1/1 [00:00<00:00, 918.19it/s] done
updating object cache: 100%|█████████████████████████████████████████| 1/1 [00:00<00:00, 118.53it/s] done
added 1 new files to asset
list of added:
#    Location           Size    Cloned
---  ---------------  ------  --------
0    hello_world.txt    1 KB         ✓
```

- Let's check the status of the asset again to see the changes:
- `ama status` : to check the status of the asset

```bash
(ama-env) my_new_asset % ama status
asset: trained_models/temp_1727989833
version: temp_1727989833

Changes to be committed:
	(use: ama discard --staged <file>... --> to discard changes to a file)
		added:   hello_world.txt

Untracked files:
	(use: ama add <file>... --> to add files, dirs to asset)
		new:   my_file.txt

(use: ama discard --all --> to discard all staged and unstaged changes)
```

- Notice the `hello_world.txt` file is now moved from `Untracked` to staged state.
- Let's add all the untracked files to the asset using the following command:
- `ama add .` : to add all the untracked files in the current directory

```bash
(ama-env) my_new_asset % ama add .
target: ['.']
collecting source information: ... done
this will add 2 files to the asset, do you wish to continue? options: (y/n), default: [y]: y
creating objects: 100%|█████████████████████████████████████████████| 2/2 [00:00<00:00, 1777.62it/s] done
updating object cache: 100%|█████████████████████████████████████████| 2/2 [00:00<00:00, 353.74it/s] done
added 1 new files to asset
list of added:
#    Location       Size    Cloned
---  -----------  ------  --------
0    my_file.txt    1 KB         ✓
found 1 existing file in the asset, list of existing:
#    Location           Size    Cloned
---  ---------------  ------  --------
0    hello_world.txt    1 KB         ✓
```

- Let's check the status one more time to see the changes:
- `ama status` : to check the status of the asset

```bash
(ama-env) my_new_asset % ama status
asset: trained_models/temp_1727989833
version: temp_1727989833

Changes to be committed:
	(use: ama discard --staged <file>... --> to discard changes to a file)
		added:   my_file.txt
		added:   hello_world.txt

(use: ama discard --all --> to discard all staged and unstaged changes)
```

- Now both the files are in the staged state and ready to be committed/uploaded.

### Uploading the asset

- After adding the files that we want to include in the asset, we need to commit it by uploading the asset.
- Uploading a new asset will give you a new sequence id and version number.
- `ama upload -m "commit message"` : to upload the asset to remote

```bash
my_new_asset % ama upload -m "Initial commit"
uploading commit: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx - 'Initial commit'
uploading derived contents
downloading asset-meta data: 100%|████████████████████████████████████| 3/3 [00:00<00:00,  7.79it/s] done - downloading 3 files took: 0.39 sec
verifying checksum: 100%|███████████████████████████████████████████| 3/3 [00:00<00:00, 4545.85it/s] done - verifying 3 files took: 0.00 sec
success
asset upload complete
updated version: 0.0.0
uploading files: 100%|████████████████████████████████████████████████| 2/2 [00:02<00:00,  1.22s/it] 
```

- Let's check the status of the asset after uploading:
- `ama status` : to check the status of the asset

```bash
(ama-env) my_new_asset % ama status
asset: trained_models/1
version: 0.0.0
asset is clean, there are no changes
```

- Notice we have a sequence id `1` and version number `0.0.0` for the asset now.
- We can now use the asset-name `trained_models/1` to refer to this asset in the future.
- The sequence id might be different for you, so make sure to use the correct sequence id from your output.

### Downloading the asset

- After you have uploaded the asset, you or your team members can easily download it from remote to start working on it.
- To download the asset, you just need to know the asset-name i.e. `trained_models/1`.
- The sequence id might be different for you, so make sure to use the correct asset-name from previous section.
- Not specifying the version will download the latest version of the asset.
- If you want to download a specific version, you can specify the version number with the asset-name i.e.
  `trained_models/1/0.0.0`.
- Use a new directory to download the asset to keep things organized.
- `ama clone trained_models/1` : to download the asset

```bash
(ama-env) ~ % ama clone trained_models/1
checking if asset exists (trained_models/1): ... done: found asset
all files available, skipping download
asset data exists - skipping download
constructing asset list for class: trained_models: ... done
nothing to download
linking objects: 100%|███████████████████████████████████████████████| 2/2 [00:00<00:00, 566.76it/s] done - linking 2 files took: 0.00 sec using linking type: copy
Success
asset: trained_models/1 is  cloned and ready to use
use: (cd trained_models/1 && asset info) --> to view the asset
```

- This will create a new directory with the asset-name `trained_models/1` and download the asset files to it.
- You can now navigate to the asset directory and start working on the asset.
- To view the asset information, you can use the following command:
- `ama info` : to view the asset information

```bash
(ama-env) trained_models/1 % ama info
project:      ML-Model-Training
asset:        trained_models/1
version:      1.0.0
size:         1 MB
hash:         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
created_by:   user1
created_at:   2023/09/17 14:32:47 -0700
asset id:     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
asset class:  trained_models
alias:        sentiment_analyzer_v1
refs:         ["production", "stable"]
remote:       gs://ml-training-artifacts/models/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/commit/assets/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/1/
cloning:      all files were linked - asset fully cloned
              
#    Location           Size    Cloned
---  ---------------  ------  --------
0    hello_world.txt    1 KB         ✓
1    my_file.txt        1 KB         ✓
(use: ama status --> to view any changes to the asset)
```

- Notice the asset information and the files that are part of the asset. Those are the same files that we created and
  uploaded earlier.

### Updating the asset

- We can update or add any new files to the current asset and upload the changes.
- Let's update the content of the `my_file.txt` file and check the status of the asset.

```bash
(ama-env) trained_models/1 % echo "We love AMA." > my_file.txt
(ama-env) trained_models/1 % ama status
asset: trained_models/1
version: 0.0.0

Changes not staged for commit:
	(use: ama discard --unstaged <file>... --> to discard changes to a file)
	(use: ama update <file>... --> to update un-staged changes to a file)
	(use: ama update --all --> to update all un-staged changes)
		modified:   my_file.txt

(use: ama discard --all --> to discard all staged and unstaged changes)
```

- Notice that the `my_file.txt` file is now `modified` and not staged.
- Let's stage the changes to the file using the following command:
- `ama update my_file.txt` : to stage the changes

```bash
(ama-env) trained_models/1 % ama update my_file.txt
collecting source information: ... done
this will add 1 files to the asset, do you wish to continue? options: (y/n), default: [y]: 
creating objects: 100%|██████████████████████████████████████████████| 1/1 [00:00<00:00, 915.59it/s] done
updating object cache: 100%|█████████████████████████████████████████| 1/1 [00:00<00:00, 157.95it/s] done
updated 1 file in the asset, list of updates:
#    Location       Size    Cloned
---  -----------  ------  --------
0    my_file.txt    1 KB         ✓
```

- Let's check the status of the asset again to verify the changes:
- `ama status` : to check the status of the asset

```bash
(ama-env) trained_models/1 % ama status
asset: trained_models/1
version: 0.0.0

Changes to be committed:
	(use: ama discard --staged <file>... --> to discard changes to a file)
		modified:   my_file.txt

(use: ama discard --all --> to discard all staged and unstaged changes)
```

- Notice the `my_file.txt` file is now in the staged state and ready to be committed/uploaded.
- Let's upload the changes to the asset using the following command:
- `ama upload -m "commit massage"` : to upload the changes to remote

```bash
(ama-env) trained_models/1 % ama upload -m "Update my_file.txt"
uploading commit: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx - 'Update my_file.txt'
uploading derived contents
downloading asset-meta data: 100%|████████████████████████████████████| 2/2 [00:00<00:00,  8.26it/s] done - downloading 2 files took: 0.24 sec
verifying checksum: 100%|███████████████████████████████████████████| 2/2 [00:00<00:00, 3199.32it/s] done - verifying 2 files took: 0.00 sec
success
asset upload complete
updated version: 0.0.1
uploading files: 100%|████████████████████████████████████████████████| 1/1 [00:01<00:00,  1.85s/it]
```

- As we were on version `0.0.0`, after uploading the changes, the new version is `0.0.1`.
- Notice that modifying the asset does not change the sequence id, only the version number is incremented.
- You can now use the new version name `trained_models/1/0.0.1` to refer to this asset in the future.
- The sequence id might be different for you, so make sure to use the correct sequence id from your output.
