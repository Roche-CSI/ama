# Conceptual Model

### What is an Asset?

We define the Asset as a single or collection of digital resources. Digital resources can be data,
code or models etc. A good way to reason about this is basically anything that can be stored and retrieved.

**Examples of Asset**


### How do we store an Asset
In AMA, assets are serialized to ```yaml``` files and stored in the gs bucket. Conceptually, an asset
holds a list of objects and other metadata. 

<pre class="code">
top_hash: 7e23XXXXXXXXXXXXXXXe3d2c
class_name: trained_models
class_id: 88xxxxfa-bxxc-1xx0-1111-a6xxxxxxxxcf1
created_by: john.smith
created_at: 2023-06-15T14:27:33-PDT
objects:
- path: sequence_data/trained_models.json
  created_by: john.smith
  created_at: 2025-02-15T14:29:52-PDT
  content:
    id: gs:md5$+MRxxxxxxxx/hxxxxxxxh==
    type: application/json
- path: sequence_data/chr2_variants.txt
  created_by: john.smith
  created_at: 2025-02-15T14:31:08-PDT
  content:
    id: gs:md5$3KxxxxxxxxxxUnLcQ==
    type: text/plain
</pre>

The underlying content is stored separately in a bucket or other data-stores i.e. database, ftp etc depending on the
type and source of content.



### Why do I need AMA?

<div style="text-align: justify">
AMA presents a shared hub to ensure that assets can be trusted, reused, 
and shared for greater efficiency and more accurate results over time, across collaborators, and in different machine environments
</div>


* **Trackability**: Know and lineage of every asset
* **Availability**: Run your experiments without worrying about how to plugin data. AMA will fetch the relevant dataset and make it available. Both locally and in cloud.
* **Shareability**: human friendly name to communicate assets.
* **Searchability**: Query and filter all data / metadata
* **Pipeline Integration**: seamlessly integrated into pipeline
