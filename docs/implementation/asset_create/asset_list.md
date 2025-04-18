### Listing Files in Asset

<pre class="code">
ama list
</pre>

The following steps are performed.

```mermaid
flowchart LR
    A[list command] --> B[Asset]
    B --> C[list objects]
    C --> D[get linked contents]
    
    B -.- E[Objects]
    B -.- F[Contents]
    F -.-> D
    
    style A fill:#f9d54b,stroke:#333,polygon
    style C fill:#f9d54b,stroke:#333,polygon
    style D fill:#f9d54b,stroke:#333,polygon
```

* get the list of all objects in the asset ```list(asset.objects)```
* each object has a ref to its content i.e. ```object.content``` for each object, get the ```content_hash```, ```content_type```
* list in table format
