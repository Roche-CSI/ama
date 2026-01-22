# AMA

Welcome to the official documentation for **[AMA]**. This repository contains the source code and comprehensive guides for the asset management system.

> **Note:** This documentation is structured as a portal. Click the links below to navigate to specific modules.

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
* **[Core Concepts](docs/concepts/index.md)**: Definitions of Assets, Objects, and the data model.
* **[Case Studies](docs/case_studies/index.md)**: Real-world examples and model training scenarios.

---

## 🛠️ Implementation Details

Deep dives into specific modules and internal logic.

### Asset Management
* **[Asset Creation](docs/implementation/asset_create/index.md)**: Logic for initializing, listing, and adding assets.
* **[Asset Upload](docs/implementation/asset_upload/index.md)**: Handling classes, commits, and staging content.
* **[Asset Storage](docs/implementation/asset_storage/index.md)**: How we interact with bucket storage.
* **[Asset Retrieval](docs/implementation/asset_download/index.md)**: Mechanisms for downloading assets.

### Internals
* **[Data Structures](docs/implementation/data_structures/index.md)**: The classes defining `Asset`, `Content`, and `Object`.
* **[Schema](docs/implementation/schema/index.md)**: Validation and database schemas.
* **[State Management](docs/implementation/state_management/index.md)**: How the application maintains state.

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