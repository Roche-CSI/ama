### Asset Storage Structure in Bucket

![asset-init](imgs/bucket_asset.jpg)

```mermaid
flowchart LR
    Bucket["Bucket/"] --- assets["assets/"]
    Bucket --- contents["contents/"]
    assets --- asset_class["asset_class_id/"]
    asset_class --- asset_id["asset_id/"]
    asset_id --- yaml1["0.0.0.yaml"]
    asset_id --- yaml2["0.0.1.yaml"]
    asset_id --- yaml3["0.0.2.yaml"]
    asset_id --- objects["objects.yaml"]
    contents --- dots["..."]
    
    %% Styling
    classDef directory fill:white,stroke:#333,stroke-width:1px,color:black,rx:4,ry:4
    classDef file fill:none,stroke:none,color:black
    
    class Bucket,assets,asset_class,asset_id,contents,dots directory
    class yaml1,yaml2,yaml3,objects file
```

**assets** is a directory inside the bucket. This directory holds a list of directories which are the ids of all the
asset classes.

**asset_class_id** is a directory inside assets. This directory holds of list of directory, each of which are the
ids of all the assets in that class

**asset_id** is a directory inside asset_class_id. This holds a list files

- objects.yaml: holds the list of all objects that the asset refers to
- asset.yaml: holds the root information of the asset, this is a yaml representation of the asset record from db
- version.yaml: holds the changes relevant to that version, this is a yaml representation of the version record from db

<br>
