# Changelog

All notable changes to the **amapy client** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Roche-CSI/ama/pulls)

### Added

- **GCS token support**: added `GcsClient` factory and `AsyncToken` wrapper so the GCS plugin can authenticate
  with a pre-built GCP OAuth2 access token in addition to service account
  credentials ([#76](https://github.com/Roche-CSI/ama/pull/76))
- **Project token route**: added `project_token_route` to retrieve short-lived project credentials from the
  server while activating a project or refreshing the expired token ([#77](https://github.com/Roche-CSI/ama/pull/77))

### Changed

- **Refactored GCS async storage initialisation**: simplified `AsyncStorage` and async operation classes to use the
  new `GcsClient`/`AsyncToken` abstractions, removing direct `io`/`json` handling and hardcoded service-account-only
  auth ([#76](https://github.com/Roche-CSI/ama/pull/76))
- **Token-based storage credentials**: `AppSettings.set_project_environment` now calls `valid_project_token` and
  passes the resulting token directly to `StorageCredentials`, replacing the previous
  `credentials_user` / service-account JSON flow ([#77](https://github.com/Roche-CSI/ama/pull/77))
- **Unified login route**: collapsed the separate `token_login` and `response_login` server routes into a single
  `login` route; `AuthConfig` and `AuthServer` updated accordingly
  (`email_login_route` → `login_route`) ([#77](https://github.com/Roche-CSI/ama/pull/77))
- Bumped `amapy-plugin-gcs` version **1.1.0 → 1.1.1**
- Bumped `amapy-core` version **1.1.0 → 1.1.1**

---

## [1.1.0](https://pypi.org/project/amapy/1.1.0/) - 2026-04-23

### Changed

- Upgraded Python requirement to **3.12** across all client packages (`amapy`, `amapy-core`, `amapy-contents`,
  `amapy-db`, `amapy-pluggy`, `amapy-plugin-gcr`, `amapy-plugin-gcs`, `amapy-plugin-posix`,
  `amapy-plugin-s3`, `amapy-utils`)
- Modernized all `typing` imports to use built-in generics (`list`, `dict`, `tuple`, `type`) per PEP 585 / Python
  3.12 style
