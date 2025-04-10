#### Object

Asset holds a collection of objects. An Object is a relation between Content and a file path inside the asset-repo dir of the user.


```mermaid
classDiagram
class asset_class {
        id: uuid
    }
    class asset {
        id: uuid
        asset_class: uuid
    }
    
    class asset_object_relations {
        id: uuid
        asset: uuid
        object: uuid
    }
    
    class object {
        id: uuid
        path: varchar
        content: uuid
        created_by: varchar
        created_at: timestamp
    }
    
    class content {
        id: uuid
        asset_class: uuid
    }
    
    asset --> asset_class
    asset --> asset_object_relations
    asset_object_relations --> object
    object <-- content
    content <-- asset_class 
    
    note "Example:
    afxxxxxxxf1
    gs:md55xxxxxxxxxxxxxxxxe1Q==
    bob smith
    2021-11-09T11-00-17-PST"
```

* Object to Content is a many-to-one relationship i.e. multiple Objects can point to the same content
* Each record in the Objects Table has a foreign Key to the Contents Table. 
* Object to Asset is a many-to-many relationship i.e. an Asset holds multiple Objects and the same object can be shared by multiple Assets.
* The AssetObjects Join table maintains the relationship between Objects and Assets
* Objects are stored in the Objects Table in the database and in the asset-manifest.yaml file in the bucket
