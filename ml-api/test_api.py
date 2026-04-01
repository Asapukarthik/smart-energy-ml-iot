#!/usr/bin/env python3
"""
ML API Test Script
Tests the Flask API endpoints and validates responses
"""

import requests
import json
import sys
from typing import Dict, Any

API_URL = "http://localhost:6000"
HEALTH_ENDPOINT = f"{API_URL}/health"
PREDICT_ENDPOINT = f"{API_URL}/predict"

# Test cases for predictions
TEST_CASES = [
    {
        "name": "Space Idle - Low Current (Expected: Keep OFF)",
        "data": {"motion": 0, "current": 0.1, "temperature": 25, "voltage": 230},
        "expected_wastage": 0,
        "expected_occupied": 0,
    },
    {
        "name": "Space Occupied - Normal Current (Expected: Normal Operation)",
        "data": {"motion": 1, "current": 1.5, "temperature": 28, "voltage": 230},
        "expected_wastage": 0,
        "expected_occupied": 1,
    },
    {
        "name": "Space Idle - High Current (Expected: Turn OFF)",
        "data": {"motion": 0, "current": 1.2, "temperature": 25, "voltage": 230},
        "expected_wastage": 1,
        "expected_occupied": 0,
    },
    {
        "name": "Space Occupied - High Current (Expected: Keep ON)",
        "data": {"motion": 1, "current": 2.0, "temperature": 30, "voltage": 230},
        "expected_wastage": 1,
        "expected_occupied": 1,
    },
]

ERROR_TEST_CASES = [
    {
        "name": "Missing fields",
        "data": {"motion": 0},
        "expect_error": True,
    },
    {
        "name": "Invalid data types",
        "data": {"motion": "invalid", "current": 1.2, "temperature": 25, "voltage": 230},
        "expect_error": True,
    },
    {
        "name": "Empty JSON",
        "data": {},
        "expect_error": True,
    },
]


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")


def print_result(status: str, message: str, details: str = ""):
    """Print formatted result"""
    symbol = "✓" if status == "PASS" else "✗"
    print(f"{symbol} {status}: {message}")
    if details:
        print(f"  → {details}")


def test_health() -> bool:
    """Test health check endpoint"""
    print_header("Testing Health Check")

    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)

        if response.status_code != 200:
            print_result(
                "FAIL", f"Unexpected status code: {response.status_code}")
            return False

        data = response.json()

        if not data.get("status") == "ok":
            print_result("FAIL", "Health status is not 'ok'")
            return False

        if not data.get("models_loaded"):
            print_result("FAIL", "Models are not loaded!")
            return False

        print_result("PASS", "Health check successful")
        print(f"  → Status: {data.get('status')}")
        print(f"  → Models Loaded: {data.get('models_loaded')}")
        return True

    except requests.exceptions.ConnectionError:
        print_result("FAIL", f"Cannot connect to {API_URL}")
        print("  → Is the ML API running? Try: python app.py")
        return False
    except Exception as e:
        print_result("FAIL", f"Health check error: {str(e)}")
        return False


def test_predictions() -> bool:
    """Test prediction endpoint with valid cases"""
    print_header("Testing Predictions (Valid Cases)")

    all_passed = True

    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\nTest {i}: {test_case['name']}")
        print(f"  Input: {json.dumps(test_case['data'], indent=2)}")

        try:
            response = requests.post(
                PREDICT_ENDPOINT,
                json=test_case["data"],
                timeout=5,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code != 200:
                print_result("FAIL", f"Status code: {response.status_code}")
                all_passed = False
                continue

            data = response.json()

            if not data.get("success"):
                print_result(
                    "FAIL", f"API returned success=false: {data.get('error')}")
                all_passed = False
                continue

            occupied = data.get("occupied")
            wastage = data.get("wastage")
            action = data.get("action")

            # Validate response structure
            if occupied is None or wastage is None or not action:
                print_result("FAIL", "Missing response fields")
                all_passed = False
                continue

            # Validate response values
            if not isinstance(occupied, int) or occupied not in [0, 1]:
                print_result("FAIL", f"Invalid occupied value: {occupied}")
                all_passed = False
                continue

            if not isinstance(wastage, int) or wastage not in [0, 1]:
                print_result("FAIL", f"Invalid wastage value: {wastage}")
                all_passed = False
                continue

            print_result("PASS", f"Prediction received")
            print(f"  → Occupied: {occupied}")
            print(f"  → Wastage: {wastage}")
            print(f"  → Action: {action}")

        except requests.exceptions.Timeout:
            print_result("FAIL", "Request timeout")
            all_passed = False
        except Exception as e:
            print_result("FAIL", f"Error: {str(e)}")
            all_passed = False

    return all_passed


def test_error_cases() -> bool:
    """Test prediction endpoint with invalid cases"""
    print_header("Testing Error Handling (Invalid Cases)")

    all_passed = True

    for i, test_case in enumerate(ERROR_TEST_CASES, 1):
        print(f"\nTest {i}: {test_case['name']}")
        print(f"  Input: {json.dumps(test_case['data'], indent=2)}")

        try:
            response = requests.post(
                PREDICT_ENDPOINT,
                json=test_case["data"],
                timeout=5,
                headers={"Content-Type": "application/json"}
            )

            # Should return an error (4xx status code)
            if response.status_code < 400:
                print_result(
                    "FAIL", f"Expected error status, got {response.status_code}")
                all_passed = False
                continue

            data = response.json()

            if data.get("success"):
                print_result("FAIL", "API should have returned success=false")
                all_passed = False
                continue

            error = data.get("error")
            if not error:
                print_result("FAIL", "No error message provided")
                all_passed = False
                continue

            print_result(
                "PASS", f"Error correctly returned (Status: {response.status_code})")
            print(f"  → Error: {error}")

        except Exception as e:
            print_result("FAIL", f"Error: {str(e)}")
            all_passed = False

    return all_passed


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  ML API TEST SUITE")
    print("="*60)

    print(f"\nAPI Endpoint: {API_URL}")

    # Run tests
    health_ok = test_health()

    if not health_ok:
        print_header("Tests Stopped")
        print("\n❌ API is not responding. Cannot continue with other tests.\n")
        sys.exit(1)

    predictions_ok = test_predictions()
    errors_ok = test_error_cases()

    # Summary
    print_header("Summary")

    all_ok = predictions_ok and errors_ok

    if all_ok:
        print("\n✅ All tests passed! ML API is working correctly.\n")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please review the output above.\n")
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user.")
        sys.exit(1)
