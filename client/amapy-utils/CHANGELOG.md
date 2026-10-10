# Changelog

All notable changes to **amapy-utils** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased (1.2.0)

### Added

- **Python 3.14 support**: changed the `amapy-utils` requirement from Python 3.12 to 3.14 and added the corresponding
  package classifier
- **Utility test coverage**: expanded tests for file checksums, MIME types, paths, logging, and common utility functions

### Changed

- **Dependencies**: upgraded Python tooling and package dependencies, and replaced `crcmod` with `google-crc32c`
- **Checksum handling**: use `google-crc32c` for CRC32C and return hexadecimal checksums in uppercase while preserving
  Base64 output; centralize file-processing chunk size in `FILE_READ_CHUNK_SIZE`
- **Utility compatibility**: adopt modern optional type hints and built-in generics, use `datetime.UTC` and `ZoneInfo`,
  and update file MIME handling and error logging
- **Logging pagination**: use Python's `pydoc.pager` for paged user logs and clarify the `UserLog.colors` return type

### Removed

- Removed the custom pager implementation and its package metadata
- Removed unused dependencies, including `pypager`, `pytz`, `crcmod`, `pyopenssl`, and `speedtest-cli`
