### Removing files from an asset

<pre class="code">
cd your_dir
ama remove file
</pre>

The following steps are performed.


```mermaid
flowchart TD
    A{{remove command}} --> B[Asset]
    B --> C{{Find objects matching file_path}}
    
    %% Object stack connected to Asset and Find objects
    J[Objects] -.- B
    J -.-> C
    
    C --> D[Objects]
    D --> E{{If multiple, remove last added Object}}
    E --> F{{Remove Object Reference from Content}}
    E --> G{{Link the previous Object to path, if any}}
    G --> F
    
    %% Single Contents connected to Asset, Remove Object Reference, and Remove file
    K[Contents] -.- B
    K -.-> F
    F --> K
    K --> I{{Remove file. If content-ref counter is 0, remove cached-file}}
```


* Normalize the user-input path to asset_repo dir
* Find all objects that match the path ```asset.objects.filter(lambda x: x.path == path)```
* Remove the object from asset, if multiple objects, we remove the last added object
* Remove the object reference from linked content, if ref count of content is 0 - remove the cached file pointed to by the content
* If multiple Objects were found earlier, and we had removed the last object then we link the previous object to the file-path
