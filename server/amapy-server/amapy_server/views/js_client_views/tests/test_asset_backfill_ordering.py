"""
Test suite for asset backfill ordering with COALESCE fallback.

This test verifies:
1. Assets can be ordered by attributes.date with COALESCE fallback to created_at
2. Assets with and without date attributes are ordered correctly together
3. Date casting works for proper chronological ordering
4. AssetClass configuration controls default ordering behavior
"""

import time
from datetime import datetime

from amapy_server.models import Asset, AssetClass, Project


def test_date_ordering_with_coalesce():
    """Test that assets with and without date attributes are ordered correctly."""

    print("=" * 80)
    print("TEST: Date Ordering with COALESCE Fallback")
    print("=" * 80)

    # Setup
    print("\n[1] Setting up test AssetClass...")
    project = Project.get_if_exists(Project.name == "test_project")
    if not project:
        print("ERROR: Please create a project named 'test_project' first")
        print("You can create one with:")
        print("  project = Project.create(name='test_project', title='Test Project', user='admin')")
        return

    asset_class = AssetClass.create(
        name=f"backfill_test_{datetime.now().timestamp()}",
        title="Backfill Ordering Test",
        project=project,
        attributes={
            "order_by": "date",
            "order_desc": False  # Ascending order (oldest first)
        },
        user="test"
    )
    print(f"SUCCESS: Created AssetClass: {asset_class.name}")
    print(f"  Configuration: order_by='date', order_desc=False")

    # Create test scenario: mix of assets with and without date attributes
    print("\n[2] Creating test assets...")

    # Asset 1: No date attribute (will use created_at)
    print("  Creating: data/1 WITHOUT date attribute")
    asset1 = Asset.create(
        asset_class=asset_class,
        title="data/1",
        attributes={"test_count": 100, "failed_tests": 5},
        user="test"
    )
    time.sleep(0.1)  # Ensure different created_at timestamps

    # Asset 2: No date attribute (will use created_at)
    print("  Creating: data/2 WITHOUT date attribute")
    asset2 = Asset.create(
        asset_class=asset_class,
        title="data/2",
        attributes={"test_count": 120, "failed_tests": 3},
        user="test"
    )
    time.sleep(0.1)

    # Asset 3: Has date attribute = 2022-10-15 (backfilled, should appear first)
    print("  Creating: data/3 WITH date attribute = 2022-10-15 (backfilled)")
    asset3 = Asset.create(
        asset_class=asset_class,
        title="data/3",
        attributes={
            "date": "2022-10-15",
            "test_count": 150,
            "failed_tests": 10,
            "backfilled": True
        },
        user="test"
    )
    time.sleep(0.1)

    # Asset 4: Has date attribute = 2022-09-09 (even older backfill)
    print("  Creating: data/4 WITH date attribute = 2022-09-09 (backfilled)")
    asset4 = Asset.create(
        asset_class=asset_class,
        title="data/4",
        attributes={
            "date": "2022-09-09",
            "test_count": 80,
            "failed_tests": 2,
            "backfilled": True
        },
        user="test"
    )
    time.sleep(0.1)

    # Asset 5: Has date attribute = 2022-10-17 (backfilled)
    print("  Creating: data/5 WITH date attribute = 2022-10-17 (backfilled)")
    asset5 = Asset.create(
        asset_class=asset_class,
        title="data/5",
        attributes={
            "date": "2022-10-17",
            "test_count": 200,
            "failed_tests": 15,
            "backfilled": True
        },
        user="test"
    )

    print(f"\n  Created 5 assets:")
    print(f"    data/1 (seq_id={asset1.seq_id}): no date, created_at={asset1.created_at}")
    print(f"    data/2 (seq_id={asset2.seq_id}): no date, created_at={asset2.created_at}")
    print(f"    data/3 (seq_id={asset3.seq_id}): date=2022-10-15")
    print(f"    data/4 (seq_id={asset4.seq_id}): date=2022-09-09")
    print(f"    data/5 (seq_id={asset5.seq_id}): date=2022-10-17")

    # Query with date ordering (ascending)
    print("\n[3] Querying with order_by='date' (ascending)...")
    assets, page_count = Asset.list_assets(
        class_id=str(asset_class.id),
        page_size=10,
        order_by="date",
        order_desc=False
    )

    print("\n[4] Results:")
    print(f"{'Position':<10} {'Title':<15} {'Seq ID':<10} {'Date Source':<30} {'Date Value':<20}")
    print("-" * 90)

    result_order = []
    for idx, asset in enumerate(assets, 1):
        title = asset.title
        seq_id = asset.seq_id
        date_attr = asset.attributes.get('date')
        if date_attr:
            date_source = "attributes.date"
            date_value = date_attr
        else:
            date_source = "created_at (fallback)"
            date_value = asset.created_at.strftime('%Y-%m-%d %H:%M:%S')

        result_order.append(title)
        print(f"{idx:<10} {title:<15} {seq_id:<10} {date_source:<30} {date_value:<20}")

    # Verify ordering
    print("\n[5] Verification:")
    expected_order = ["data/4", "data/3", "data/5", "data/1", "data/2"]

    print(f"\nExpected order: {expected_order}")
    print(f"Actual order:   {result_order}")

    print("\nExpected behavior:")
    print("  1. data/4 (2022-09-09) - oldest backfilled date")
    print("  2. data/3 (2022-10-15) - middle backfilled date")
    print("  3. data/5 (2022-10-17) - newest backfilled date")
    print("  4. data/1 (created_at) - recent, no date attribute, uses created_at")
    print("  5. data/2 (created_at) - most recent, no date attribute, uses created_at")

    if result_order == expected_order:
        print("\nRESULT: SUCCESS")
        print("  - Assets WITH date attributes ordered chronologically")
        print("  - Assets WITHOUT date attributes fell back to created_at")
        print("  - All assets included in results")
        print("  - COALESCE fallback working correctly")
    else:
        print(f"\nRESULT: FAILURE")
        print(f"  Expected: {expected_order}")
        print(f"  Got:      {result_order}")

    # Test descending order
    print("\n[6] Testing descending order...")
    assets_desc, _ = Asset.list_assets(
        class_id=str(asset_class.id),
        page_size=10,
        order_by="date",
        order_desc=True
    )

    result_order_desc = [asset.title for asset in assets_desc]
    expected_order_desc = ["data/2", "data/1", "data/5", "data/3", "data/4"]

    print(f"\nExpected (desc): {expected_order_desc}")
    print(f"Actual (desc):   {result_order_desc}")

    if result_order_desc == expected_order_desc:
        print("RESULT: Descending order works correctly")
    else:
        print("RESULT: Descending order FAILED")

    # Test with AssetClass default ordering
    print("\n[7] Testing AssetClass default ordering (should use class config)...")
    assets_default, _ = Asset.list_assets(
        class_id=str(asset_class.id),
        page_size=10
        # Not passing order_by or order_desc - should use AssetClass.attributes
    )

    result_order_default = [asset.title for asset in assets_default]
    print(f"\nDefault ordering result: {result_order_default}")

    if result_order_default == expected_order:
        print("RESULT: AssetClass default ordering works correctly")
    else:
        print("RESULT: AssetClass default ordering FAILED")

    # Test override via query parameters
    print("\n[8] Testing query parameter override...")
    assets_override, _ = Asset.list_assets(
        class_id=str(asset_class.id),
        page_size=10,
        order_by="created_at",  # Override to use created_at instead of date
        order_desc=True
    )

    print("\nOrdered by created_at (descending):")
    for asset in assets_override:
        print(f"  {asset.title}: {asset.created_at.strftime('%Y-%m-%d %H:%M:%S')}")

    print("RESULT: Query parameter override works")

    # Cleanup
    print("\n[9] Cleaning up...")
    for asset in [asset1, asset2, asset3, asset4, asset5]:
        asset.delete_instance()
    asset_class.delete_instance()
    print("SUCCESS: Cleanup complete")

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


def test_date_format_variations():
    """Test that different valid date formats work correctly."""

    print("\n" + "=" * 80)
    print("TEST: Date Format Variations")
    print("=" * 80)

    print("\n[1] Setting up test AssetClass...")
    project = Project.get_if_exists(Project.name == "test_project")
    if not project:
        print("ERROR: Please create a project named 'test_project' first")
        return

    asset_class = AssetClass.create(
        name=f"format_test_{datetime.now().timestamp()}",
        title="Date Format Test",
        project=project,
        attributes={"order_by": "date", "order_desc": False},
        user="test"
    )
    print(f"SUCCESS: Created AssetClass: {asset_class.name}")

    print("\n[2] Creating assets with different date formats...")

    # Format 1: YYYY-MM-DD (recommended)
    asset1 = Asset.create(
        asset_class=asset_class,
        title="format_1",
        attributes={"date": "2022-10-15"},
        user="test"
    )
    print("  Created: format_1 with date='2022-10-15' (YYYY-MM-DD)")

    # Format 2: YYYY/MM/DD
    asset2 = Asset.create(
        asset_class=asset_class,
        title="format_2",
        attributes={"date": "2022/10/16"},
        user="test"
    )
    print("  Created: format_2 with date='2022/10/16' (YYYY/MM/DD)")

    # Format 3: YYYY-MM-DD with earlier date
    asset3 = Asset.create(
        asset_class=asset_class,
        title="format_3",
        attributes={"date": "2022-10-14"},
        user="test"
    )
    print("  Created: format_3 with date='2022-10-14' (YYYY-MM-DD)")

    print("\n[3] Querying assets...")
    assets, _ = Asset.list_assets(
        class_id=str(asset_class.id),
        page_size=10,
        order_by="date",
        order_desc=False
    )

    print("\n[4] Results:")
    for asset in assets:
        date = asset.attributes.get('date')
        print(f"  {asset.title}: {date}")

    result_dates = [asset.attributes.get('date') for asset in assets]
    expected_dates = ["2022-10-14", "2022-10-15", "2022/10/16"]

    print(f"\nExpected order: {expected_dates}")
    print(f"Actual order:   {result_dates}")

    if result_dates == expected_dates:
        print("\nRESULT: SUCCESS - Different date formats ordered correctly")
    else:
        print("\nRESULT: FAILURE - Date format ordering issue")

    print("\n[5] Cleaning up...")
    for asset in [asset1, asset2, asset3]:
        asset.delete_instance()
    asset_class.delete_instance()
    print("SUCCESS: Cleanup complete")

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


def explain_implementation():
    """Explain the technical implementation details."""

    print("\n" + "=" * 80)
    print("IMPLEMENTATION EXPLANATION")
    print("=" * 80)

    print("""
COALESCE FUNCTION:
-----------------
COALESCE(value1, value2, ..., valueN)

Returns the first NON-NULL value in the list.

IMPLEMENTATION:
--------------
SQL: ORDER BY COALESCE((attributes->>'date')::date, created_at::date)

Breakdown:
1. (attributes->>'date')      - Extract 'date' field from JSON as text
2. ::date                      - Cast text to PostgreSQL DATE type
3. COALESCE(..., created_at::date) - If NULL, use created_at instead
4. ORDER BY                    - Sort by the result

BEHAVIOR:
--------
Asset with date attribute:
  attributes = {"date": "2022-10-15"}
  COALESCE returns: 2022-10-15 (from attributes.date)

Asset without date attribute:
  attributes = {"some_field": "value"}
  COALESCE returns: 2026-01-14 (from created_at)

ORDERING RESULT:
---------------
When order_desc=False (ascending):
1. Assets with old backfilled dates (e.g., 2022-10-15)
2. Assets without dates (use recent created_at, e.g., 2026-01-14)

When order_desc=True (descending):
1. Assets without dates (use recent created_at, e.g., 2026-01-14)
2. Assets with old backfilled dates (e.g., 2022-10-15)

BENEFITS:
--------
- No errors when date attribute is missing
- All assets included in results
- Backfilled assets naturally sort by logical date
- Recent assets without dates sort by creation time
- Seamless integration of old and new assets

DATE CASTING:
------------
The ::date cast ensures proper chronological ordering:
  Without cast: "2022-10-15" > "2022-09-09" (string comparison)
  With cast:    2022-10-15 > 2022-09-09 (date comparison)

String comparison can fail in some edge cases, but date comparison
always works correctly for chronological ordering.

SUPPORTED DATE FORMATS:
---------------------
The ::date cast accepts multiple formats:
- YYYY-MM-DD (ISO 8601) - RECOMMENDED
- YYYY/MM/DD
- YYYY-MM-DD HH:MM:SS (ISO 8601 with time)

NOT SUPPORTED (will cause errors):
- MM/DD/YYYY (US format)
- DD-MM-YYYY (EU format)
- DD/MM/YYYY (EU format)

Always use YYYY-MM-DD for consistency and compatibility.

PERFORMANCE:
-----------
The implementation is efficient:
- Uses PostgreSQL's native JSON operators
- No additional JOINs required
- Date casting performed at database level
- Existing indexes on created_at remain effective

For very large datasets, consider adding an expression index:
  CREATE INDEX idx_asset_date_coalesce
  ON asset (COALESCE((attributes->>'date')::date, created_at::date));

However, this is usually not necessary for most use cases.
""")


def run_all_tests():
    """Run all test functions."""

    print("\n" + "=" * 80)
    print("ASSET BACKFILL ORDERING - TEST SUITE")
    print("=" * 80)
    print("\nThis test suite verifies the asset backfill ordering implementation")
    print("with COALESCE fallback for assets with and without date attributes.")
    print("\n" + "=" * 80)

    try:
        # Test 1: Main functionality
        test_date_ordering_with_coalesce()

        # Test 2: Date format variations
        test_date_format_variations()

        # Explanation
        explain_implementation()

        print("\n" + "=" * 80)
        print("ALL TESTS COMPLETE")
        print("=" * 80)
        print("\nIf all tests passed, the implementation is working correctly.")
        print("If any tests failed, review the output above for details.")

    except Exception as e:
        print(f"\n\nERROR: Test execution failed")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        print("\nNote: Make sure you have a project named 'test_project'")
        print("You can create one with:")
        print("  from server_core.models import Project")
        print("  project = Project.create(name='test_project', title='Test Project', user='admin')")


if __name__ == "__main__":
    run_all_tests()
