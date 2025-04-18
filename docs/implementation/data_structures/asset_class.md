#### Asset Collection

<div class="justified">
Conceptually, the Asset Collection is a classification of similar types of assets
depending on the use case. You could define a `text_analysis` asset-class to store relevant assets pertaining to
natural language processing components. Similarly, you might declare a `model_training` or `sequence_analyzer` asset-class to manage all their relevant
assets. All assets belonging to an asset-class share the same storage in the cloud bucket, which helps optimize storage requirements
since files with the same content need not be uploaded again.
</div>


```mermaid
classDiagram
    class asset_class {
        id uuid 
         class_name varchar
         top_hash varchar
         created_by varchar
    }
    
   
    note "example :
    n4xxxxxxa-xxxa-xxx0-xxxc-axxxxxxxxf1
    resource_model
    960exxxxxxxxxxxxxxxxxxxxxxxxc56
    bob prat"
```
