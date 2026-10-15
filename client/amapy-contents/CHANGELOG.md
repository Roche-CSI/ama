# Changelog

All notable changes to **amapy-contents** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased (1.2.0)

### Added

- **Python 3.14 support**: changed the Python requirement from Python 3.12 to 3.14 and added the corresponding package
  classifier
- **Compatibility test coverage**: added tests for fresh-process module imports, runtime annotation evaluation, nullable
  defaults, and source-type detection

### Changed

- **Dependencies**: upgraded `aiohttp` to `3.13.*`; depends on `amapy-db`, `amapy-pluggy` and `amapy-utils` `1.2.*`
- **Type hints**: use explicit `| None` unions for nullable content, stat and uploader fields and parameters; refine
  built-in generics (`list[str]`, `tuple[str, str]`, `Callable[...]`) and add return annotations
- **Import organization**: `ContentSet` imports `ContentFactory` at module level instead of inside a method;
  `BlobStoreContent` imports `Content` from `.content` rather than via `.posix_content`

### Removed

- Removed `from __future__ import annotations` from content, stat and storage modules, relying on Python 3.14's native
  deferred annotation evaluation
- Removed the `TYPE_CHECKING`-only `google.cloud.storage.blob.Blob` import and its `isinstance` check in `src_type`,
  which raised `NameError` at runtime for non-string, non-dict sources
- Removed redundant `object` base class and `super(Class, self)` call in `FileStat` / `ContentStat`
