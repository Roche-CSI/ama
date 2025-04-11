#### Commit Asset

<div class="justified">
After the files are successfully uploading to staging area, we identify the linked objects to those files. These objects
can now be committed to the asset. The asset and object are committed together since they are inter-linked. 

The Asset-commit process is a handoff to the asset-server which performs the following steps. The BaseAsset-server receives the request from asset-client. The payload is in the following format
</div>

<pre class="code">
{
  "class_id": 00000000-0000-0000-0000-000000000001
  "parent_asset_id": 00000000-0000-0000-0000-000000000011,
  "alias": "my_asset",
  "objects": [...],
  "patch": "...",
}
</pre>

<br>

##### Ensuring Atomicity of the Asset-Commit process
Its possible, that the previous commit was interrupted and didn't go through. A few possible reasons could be

* **Network failure with User**: Content staging was successful, but a network error happened at the user-end during the commit process. In such a case
  the asset-client will try to first complete the previous commit before initiating a new transaction. The server should 
  expect to receive the same payload next-time since the transaction was not completed.
  
* **Network failure with Server**: Similar issue as the above but this time, there was an error on the server-side in either gcs access or database access
    
* **User Interruption**: i.e. ctrl + c

To ensure atomicity, we need to make sure the previous transaction was committed successfully. In order to achieve this we break down the
asset-commit flow into 2 different stages. 

<br>

**Asset Commit flow - Stage 1**


```mermaid
%% graph TD
%%     AssetClient["A"] --> AskForId["Ask for Id"]
%%     AmaServer["ama-Server"]
    
%%     AskForId -->|"1 class_name, parent_id"| CreateRecord
%%     CreateRecord -->|2| AmaServer
%%     CreateRecord -->|" 3   asset_id"| AskForId
%%     AskForId -->|4| SaveAssetId["Save asset_id"]
%%     SaveAssetId --> Asset["Asset"]
    
   
    
%%     class AssetClient client
%%     class AssetServer server
%%     class AskForId,CreateRecord,SaveAssetId decision
%%     class Asset asset

flowchart TD
    AssetClient["Client"] --> AskForId["Ask for Id"]
    AssetServer["ama-Server"]
    CreateRecord["Create record if not exists"]
    
    AskForId -->|"1 class_name, parent_id"| CreateRecord
    CreateRecord -->|2| AssetServer
    CreateRecord -->|"3 asset_id"| AskForId
    AskForId -->|4| SaveAssetId["Save asset_id"]
    SaveAssetId --> Asset["Asset"]
    
    %% Styling
    classDef client fill:#FFC107,stroke:#333,stroke-width:2px,color:black
    classDef server fill:#FFC107,stroke:#333,stroke-width:2px,color:black
    classDef decision fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef asset fill:white,stroke:#333,stroke-width:1px,color:black
    
    class AssetClient client
    class AssetServer server
    class AskForId,CreateRecord,SaveAssetId decision
    class Asset asset
```

In stage-1 the ```Asset-Client``` checks if the asset to be committed has an id, if not, it requests for an id to the asset-server. The request payload
contains the class_name, and the parent_asset_id (if asset inherits from a different asset). The ```Asset-Server``` receives the request, creates a record
in the asset-table (with seq_id and version) and returns the asset_id to the Client. 

<br>

**Asset Commit flow - Stage 2**

In stage-2, the asset-client requests for the asset to committed. The commit process involves the following steps.

* Transfer contents from staging area in to remote-repo, do checksum validation.
* Create records in Content table, if not exist already
* Create records in Objects table, if not exist already
* Create records in Asset-Objects join table
* Update asset-record with commit-hash
* Respond to client with commit-hash


If the commit process is successful, the asset-server updates the asset-record with a commit-hash
and returns the commit-hash to client. Any time, the asset-client initiates a commit, it first checks if the existing asset has a commit-hash, if it finds a commit-has
this means the previous commit was successful, so the client then moves to follow the 2 stage process. 
If the previous commit was unsuccessful, the client will initiate stage-2 again i.e. commit the previous asset along with new updates if any.

<br>

**The Previous transaction got interrupted now user wants to add more files to assets**

To verify, check if the previous record created by the same user with node_type and node_name
    has a commit_hash. If commit_hash is missing - then we presume the current updates are also part of the
    same commit, and we try to recommit.

<br>
