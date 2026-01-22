# AMA

Welcome to the official documentation for **AMA**. This repository contains the source code and comprehensive guides for the asset management system.

---

## 🚀 Getting Started

If you are new to the project, start here to get up and running.

| Guide                                        | Description |
|:---------------------------------------------| :--- |
| **[Overview](docs/overview.md)**             | High-level summary of the project goals and scope. |
| **[Installation](docs/install.md)**               | Requirements and steps to install the environment. |
| **[Quick Start](docs/quick_start.md)**            | Run your first command in under 5 minutes. |
| **[Hello World](docs/user_guide/hello_world.md)** | A simple hands-on tutorial for end-users. |

---

## 🧠 Concepts & Architecture

Understand the theory and design behind the code.

* **[Architecture](docs/architecture.md)**: Diagrams and explanations of the system design.
* **[Core Concepts](docs/concepts/asset.md)**: Definitions of Assets, Objects, and the data model.
* **[Case Studies](docs/case_studies/model_training.md)**: Real-world examples and model training scenarios.

---

## 🛠️ Implementation Details

Deep dives into specific modules and internal logic.

### Asset Creation & Lifecycle
* **[Asset Init](docs/implementation/asset_create/asset_init.md)**: Procedures for initializing new asset repositories or local workspaces.
* **[Asset Add](docs/implementation/asset_create/asset_add2.md)**: Workflows for registering new assets into the system.
* **[Asset Upload](docs/implementation/asset_create/asset_upload.md)**: The specific mechanism for uploading asset binaries during creation.
* **[Asset Remove](docs/implementation/asset_create/asset_remove.md)**: Commands and safety checks for deleting or deprecating assets.
* **[Asset List](docs/implementation/asset_create/asset_list.md)**: Functionality for querying, listing, and filtering available assets.

### Asset Upload & Version Control
* **[Asset Upload Overview](docs/implementation/asset_upload/index.md)**: High-level guide to the upload lifecycle, classes, and commit strategies.
* **[Asset Class Create](docs/implementation/asset_upload/asset_class_create.md)**: Defining and registering new asset classes (types/categories).
* **[Stage Content](docs/implementation/asset_upload/stage_content.md)**: Preparing and staging data files prior to the final commit.
* **[Asset Commit](docs/implementation/asset_upload/asset_commit.md)**: Finalizing changes and versioning the staged asset content.

### Storage & Retrieval
* **[Bucket Storage](docs/implementation/asset_storage/bucket_storage.md)**: Implementation details for interacting with S3/Blob bucket storage.
* **[Asset Retrieval](docs/implementation/asset_download/index.md)**: Protocols and APIs for downloading and retrieving asset data.


### Internals

**Data Structures**
* **[Overview](docs/implementation/data_structures/index.md)**: High-level summary of the core data models and class hierarchy.
* **[Asset Class](docs/implementation/data_structures/asset_class.md)**: Definitions for asset categories, type configurations, and templates.
* **[Asset](docs/implementation/data_structures/asset.md)**: The core `Asset` entity structure, including identification, versioning, and metadata.
* **[Content](docs/implementation/data_structures/content.md)**: Data structures representing the physical files, payloads, or blobs attached to an asset.
* **[Object](docs/implementation/data_structures/object.md)**: The base generic `Object` class containing shared properties used across the system.

**System Logic**
* **[Schema](docs/implementation/schema/index.md)**: definitions for data validation, serialization rules, and database schemas.
* **[State Management](docs/implementation/state_management/index.md)**: Mechanisms for tracking application state, session context, and caching.

---

## 🐍 Python API Reference

For developers integrating this library into their own tools.

* **[API Documentation](docs/python_api/index.md)**: Full function and class reference.

---

## 📂 Repository Structure

A quick view of the top-level directory layout:

* `/client` - The client-side python component.
* `/docs` - Explanatory articles and diagrams.
* `/frontend` - [Docs](frontend/README.md) - The main codebase for all UI.
* `/server` - [Docs](server/amapy-server/README.md) - The server-side component of the ama system.

---
# Instructions

## Documentation generation

- Utility requirements are listed at `requirements.txt`
- Install the requirements
  - `pip install -r requirements.txt`
- Build documentation
  - `mkdocs build`
- Serve locally
  - `mkdocs serve -a localhost:8080`