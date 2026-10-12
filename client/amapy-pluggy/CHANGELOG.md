# Changelog

All notable changes to **amapy-pluggy** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased (1.2.0)

### Added

- **Python 3.14 support**: changed the Python requirement from Python 3.12 to 3.14 and added the corresponding package
  classifier
- **Compatibility test coverage**: added tests for fresh-process module imports, deferred hook-spec loading, runtime
  annotation evaluation, nullable defaults, forward references, callbacks, and transport checksums

### Changed

- **Dependencies**: upgraded `setuptools` to `>=80.9.0,<81.0.0`, `amapy-utils` to `1.2.*`, and `pluggy` to `1.6.*`
- **Type hints**: use explicit `| None` unions for nullable storage, blob, URL, and transporter fields and parameters;
  refine built-in generics for providers, source paths, and hashes, and specify callback signatures
- **Import organization**: reorganized imports across plugin and storage modules and related tests

### Removed

- Removed redundant `from __future__ import annotations` imports from `StorageData` and `TransportResource`, relying on
  Python 3.14's native deferred annotation evaluation
