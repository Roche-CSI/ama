#### Find Files to be Uploaded

Once we have the class_id and top_hash - the asset-contents can be uploaded to staging area. We now query the asset to get a list of files that
require to be uploaded. To maintain data integrity, a file must meet the following conditions in order to be a
candidate for upload.

* added by the user
* have not been deleted, modified or renamed


```mermaid
flowchart TD
    Content["Content"] --> File["File"]
    File --> AddedByUser["Added by user"]
    AddedByUser -->|No| Ignore["ignore"]
    AddedByUser -->|Yes| IsDeleted["Is Deleted"]
    IsDeleted -->|Yes| AskRemove["Ask user to remove.   
    'ama remove file'"]
    IsDeleted -->|No| IsModified["Is Modified"]
    IsModified -->|Yes| AskReAdd["Ask user to re-add.
    'ama add file'"]
    IsModified -->|No| AddToUpload["Add to upload list"]
    AddToUpload --> UploadList["Upload list"]
    
  
    %% Styling
    classDef default fill:white,stroke:#333,stroke-width:1px,color:black
    classDef decision fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef highlight fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef command fill:white,stroke:none,color:black
    classDef list fill:white,stroke:#333,stroke-width:1px,color:black
    
    class Content,File,Ignore,UploadList default
    class AddedByUser,IsDeleted,IsModified,AddToUpload decision
    class AskRemove,AskReAdd highlight
    class Command1,Command2 command
    class UploadList list
```

Since the file sizes can be very large, in AMA, we took the approach of not copying files. Therefore,
in order to accomplish the above requirements when a file is added to asset, we compute and store metadata about the file

<pre class="code">
st_mtime: timestamp (last modified time of the file content) 
st_nlink: int (# of hardlinks to the file)
st_ctime: timestamp (last modified time of file meta data)
st_ino: int (inode number i.e. disk storage pointer for the file)
</pre>

Before uploading, we recompute the file metadata and compare with the stored values to identify if a file has been
altered by the user after adding it to asset.


#### Exclude content already available in cloud

In AMA, we use the md5 hash of the files for storage and indexing. Its possible, that a user might be adding
a file which already exists in the cloud and is indexed. In which case, the files need not be uploaded again. Therefore,
after determining the list of files to be uploaded, we check if any of the files exist in the remote storage.

If the file is already indexed it would exist in the remote repo, if another user is in the process of uploading the file
and its yet to be indexed then it would exist in the staging area. Therefore, we check both remote-repo and staging-repos.


```mermaid

graph TD
    Content[("Content")]
    CheckRemote["Check if exists"]
    RemoteRepo[("Remote repo")] --> CheckRemote
    CheckRemote -->|Yes| RemoveUpload["Remove from upload"]
    RemoveUpload -->Content
    CheckRemote --> CheckStaging["Check if exists + verify hash"]
    StagingRepo[("Staging repo")] --> CheckStaging
    CheckStaging -->|No| UploadList[("Upload list")]
    CheckStaging -->|Yes| RemoveUpload
    
    %% Styling
    classDef default fill:white,stroke:#333,stroke-width:1px,color:black
    classDef decision fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef highlight fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef stacked fill:white,stroke:#333,stroke-width:1px,color:black
    
    class Content,RemoteRepo,StagingRepo,UploadList stacked
    class CheckRemote,CheckStaging,RemoveUpload decision
```

#### User access
Staging and remote buckets are separate by design to maintain data integrity. For staging buckets, individual user will have
write acess where as for remote buckets, only the asset-server will have write-access. Individual users will have readonly-access
to the remote bucket.


```mermaid
graph TD
    AssetServer["ama-Server"] --> ReadWrite1["Read-Write"]
    ReadWrite1 --> RemoteRepo["Remote
    repo"]
    ReadWrite1 --> StagingRepo["Staging
    repo"]
    RemoteRepo --> ReadOnly["Read-only"]
    StagingRepo --> ReadWrite2["Read-Write"]
    ReadOnly --> User
    ReadWrite2 --> User
    
    %% Styling
    classDef server fill:white,stroke:#666,stroke-width:3px,color:black
    classDef access fill:white,stroke:#333,stroke-width:1px,color:black
    classDef repo fill:#f5f5f5,stroke:#333,stroke-width:1px,color:black
    classDef user fill:#66B2A0,stroke:none,color:black
    
    class AssetServer server
    class ReadWrite1,ReadOnly,ReadWrite2 access
    class RemoteRepo,StagingRepo repo
    class User user
```

#### Upload Files to Staging


```mermaid
graph TD
    Content[("Content")] --> StartUpload["Start Upload"]
    StartUpload --> StagingRepo[("Staging repo")]
    StartUpload --> Staging["Staging"]
    ChecksumValid["checksum-valid"]
    StagingRepo-- Finish Upload -->ChecksumValid -->|Yes| Staged["Staged"]
    Content --> Pending["Pending"]
    Pending --> Staging
    Staging --> Staged
    StartUpload --> ChecksumValid
    
    %% States subgraph
    subgraph States
    Pending
    Staging
    Staged
    end
    
    %% Styling
    classDef default fill:white,stroke:#333,stroke-width:1px,color:black
    classDef decision fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef stacked fill:white,stroke:#333,stroke-width:1px,color:black
    classDef state fill:white,stroke:#333,stroke-width:1px,color:black
    
    class Content stacked
    class StagingRepo stacked
    class StartUpload,ChecksumValid decision
    class Pending,Staging,Staged state
```

We use asyncio for fast concurrent network calls. The staging area is namespaced to the top-hash of the asset-class. 
