# Changelog

All notable changes to **amapy-db** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased (1.2.0)

### Added

- **Python 3.14 support**: Python requirement is `>=3.14,<3.15` with the corresponding package classifier
- **Compatibility test coverage**: added a test for fresh-process module imports and runtime annotation evaluation

### Changed

- **Dependencies**: depends on `amapy-pluggy==1.2.*` and `amapy-utils==1.2.*`
- **Type hints**: use explicit `| None` unions for nullable fields and parameters, `list[str]` / `dict` built-in
  generics, and add return annotations across all database classes
