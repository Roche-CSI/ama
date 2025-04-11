#### Asset

<div class="justified">
Everytime you call ```ama init <class_name>```, it creates an Asset i.e. new member of the asset-class. On a high level
an Asset represents a collection of all digital resources you need for your activity. Assets are automatically version tracked,
any changes you make to an asset if diffed and stored separately which can be inspected and traced back to source.
</div>


```mermaid
classDiagram
    class asset_class {
         id uuid
    }
    
    class asset {
    id uuid 
    asset_class uuid
    seq_id varchar
    version varchar
    parent_asset uuid
    owner varchar
    refs varchar
    patch text
    }
    
    asset_class --|> asset
    
    note   "Example:
    n4xxxxxxa-xxxa-xxx0-xxxc-axxxxxxxxf1
    resource_model
    2
    0.2.1
    resource_model/1/0.11
    chris prat
    [resource_model/2/0.1]
    [diff from parent_asset]"
```
