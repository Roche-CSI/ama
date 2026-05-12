# Changelog

All notable changes to **amapy-server** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/Roche-CSI/ama/pulls)

### Added

- **Backfill asset by date**: configurable ordering for asset listings allows backfilled assets to be sorted by a
  logical `attributes.date` field. Falls back to `created_at` via
  `COALESCE((attributes->>'date')::date, created_at::date)` for assets without an explicit date
  attribute ([#61](https://github.com/Roche-CSI/ama/pull/61))
- **Dashboard URL in auth response**: CLI login response now includes the dashboard URL, sourced from
  `AssetSettings` ([#59](https://github.com/Roche-CSI/ama/pull/59))

### Changed

- Migrated all internal utility imports to `amapy_utils` equivalents (`FileUtils`, `BetterSet`, `string_to_timestamp`,
  `time_it`, `cast2list`, `convert_to_pst`, `LoggingMixin`)
- Upgraded Python requirement to **3.12** ([#72](https://github.com/Roche-CSI/ama/pull/72))
- Modernized all `typing` imports to use built-in generics (`list`, `dict`, `tuple`, `type`) per PEP 585 / Python 3.12
  style
- Updated dependency versions for Python 3.12 compatibility:
    - `Flask` → 3.0.3
    - `Flask-Admin` → 2.0.x
    - `Flask-Dance` → 7.1.x
    - `Flask-Login` → 0.6.x
    - `flask-cors` → 4.0.x
    - `gunicorn` → 23.0.x
    - `elasticsearch` → 8.17.x
    - `sentence-transformers` → 3.4.x
    - `peewee` → 3.17.x
    - `psycopg2` → 2.9.x
- Refactored signed URL retrieval to use `AssetStorage` and updated related import paths
- Cleaned up code formatting in `vector_search.py` and `asset.py`

### Removed

- Internal `file_utils` module (superseded by `amapy_utils.FileUtils`)
- Internal `better_set` utility (superseded by `amapy_utils.BetterSet`)
- Deprecated utility functions from `amapy_server.__init__`
- Unused `aiothutil` dependency
- Redundant helper functions and dead test files

### Fixed

- Removed unnecessary `template_mode` parameter in Flask-Admin setup
- Corrected `None` checks and type hint in `auth_utils.py`
- Fixed type hint for `compress_data` function
- Removed `packaging` from dependencies (was unused)

---

## [1.0.2](https://pypi.org/project/amapy-server/1.0.2/) - 2025-04-29

### Added

- `ASSET_CONFIG_MODE` environment variable support for selecting the server configuration mode (dev/staging/production)
  at runtime ([#8](https://github.com/Roche-CSI/ama/pull/8))
- Frontend URL and backend URL presence validation added to server configuration
  startup ([#8](https://github.com/Roche-CSI/ama/pull/8))
- `package_name` field included in the CLI version response ([#45](https://github.com/Roche-CSI/ama/pull/45))
- Package description added to PyPI metadata ([#40](https://github.com/Roche-CSI/ama/pull/40))

### Changed

- Renamed server package from `server-core` to `amapy-server`; moved from `backend/server-core/` to
  `server/amapy-server/` ([#39](https://github.com/Roche-CSI/ama/pull/39))
- Updated all internal imports, string references, and dependency declarations following the
  rename ([#39](https://github.com/Roche-CSI/ama/pull/39))
- Reformatted code and bumped version after rename ([#39](https://github.com/Roche-CSI/ama/pull/39))

### Fixed

- Fixed sign-up flow: resolved `None` client URL in server session and corrected web login view
  handling ([#47](https://github.com/Roche-CSI/ama/pull/47))

---

## [1.0.1](https://pypi.org/project/amapy-server/1.0.1/) - 2025-03-28

### Added

- Initial release of the server-side backend for the ama digital asset management
  system ([#15](https://github.com/Roche-CSI/ama/pull/15))

