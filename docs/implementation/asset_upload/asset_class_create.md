#### Create Asset Collection

It's the asset collection that owns the storage location. So in order to be eligible for upload, an asset must have a valid
class_id

- Check if the asset has a class_id, if not - request asset_registry for id of the asset collection
- The request to asset_registry must include class_name
- asset_registry receives the request, checks if an asset collection exists for the given name. If not, the asset_registry creates an asset_class.
- client receives the class_id and top_hash from the asset_registry and updates the asset-manifest
- Asset is now eligible for upload
 

```mermaid
flowchart TD
    AssetClient["Ama"] --> RequestServer
    RequestServer{"Request Server"} -->|class_name| AssetServer["Ama-Server"]
    AssetServer --> CreateClass{"Create class record,
    if not exists"}
    CreateClass --> DB[("Database")]
    CreateClass -. class_id, top_hash .-> AssetClient
    DB -.- AssetServer

    %% Styling
    classDef client fill:white,stroke:#333,stroke-width:1px,color:black
    classDef server fill:white,stroke:#333,stroke-width:1px,color:black
    classDef decision fill:#FFC107,stroke:#333,stroke-width:1px,color:black,shape:diamond
    classDef database fill:#f5f5f5,stroke:#333,stroke-width:1px,color:black
    
    class AssetClient client
    class AssetServer server
    class RequestServer,CreateClass decision
    class DB database
```

<br>
