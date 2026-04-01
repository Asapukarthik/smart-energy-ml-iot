#!/usr/bin/env node

/**
 * Backend to ML API Integration Test
 * 
 * This script tests the backend's ability to communicate with the Flask ML API
 * 
 * Usage:
 *   node test-ml-integration.js
 * 
 * Prerequisites:
 *   - MongoDB running
 *   - Flask ML API running on http://localhost:8000
 *   - Backend running on http://localhost:5000 (or modify URL below)
 */

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = "http://localhost:5000";
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

// Test credentials
const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "Test User"
};

const TEST_SENSOR_DATA = [
  {
    name: "Space Idle - Low Current",
    data: {
      motion: 0,
      current: 0.1,
      temperature: 25,
      voltage: 230,
      lightStatus: false,
      fanStatus: false
    }
  },
  {
    name: "Space Occupied - Normal Current",
    data: {
      motion: 1,
      current: 1.5,
      temperature: 28,
      voltage: 230,
      lightStatus: true,
      fanStatus: true
    }
  },
  {
    name: "Space Idle - High Current (Wastage)",
    data: {
      motion: 0,
      current: 1.2,
      temperature: 25,
      voltage: 230,
      lightStatus: false,
      fanStatus: true
    }
  }
];

let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Color codes for terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  console.log("\n" + "=".repeat(60));
  log("blue", `  ${text}`);
  console.log("=".repeat(60) + "\n");
}

function pass(message) {
  log("green", `✓ PASS: ${message}`);
  testResults.passed++;
}

function fail(message) {
  log("red", `✗ FAIL: ${message}`);
  testResults.failed++;
}

async function testMLAPIHealth() {
  header("Step 1: Testing ML API Health");
  
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 5000 });
    
    if (response.data.status === "ok") {
      pass("ML API is running and responding");
      if (response.data.models_loaded) {
        pass("ML API models are loaded");
      } else {
        fail("ML API models are not loaded");
      }
    } else {
      fail("ML API health check returned non-ok status");
    }
  } catch (error) {
    fail(`Cannot connect to ML API at ${ML_API_URL}`);
    testResults.errors.push(`ML API Connection: ${error.message}`);
  }
}

async function testBackendHealth() {
  header("Step 2: Testing Backend Health");
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/me`, { timeout: 5000 });
    fail("Backend responded without auth token (unexpected)");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      pass("Backend is running (auth required as expected)");
    } else if (error.code === "ECONNREFUSED") {
      fail(`Cannot connect to backend at ${BACKEND_URL}`);
      testResults.errors.push(`Backend Connection: ${error.message}`);
    } else {
      fail(`Unexpected error: ${error.message}`);
      testResults.errors.push(`Backend Health: ${error.message}`);
    }
  }
}

async function testUserRegistration() {
  header("Step 3: Testing User Registration");
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, TEST_USER);
    
    if (response.data.success && response.data.token) {
      pass("User registered successfully");
      global.token = response.data.token;
      return true;
    } else {
      fail("Registration response missing token");
      return false;
    }
  } catch (error) {
    fail(`User registration failed: ${error.response?.data?.message || error.message}`);
    testResults.errors.push(`Registration: ${error.message}`);
    return false;
  }
}

async function testSensorDataWithPrediction() {
  header("Step 4: Testing Sensor Data Submit & ML Prediction");
  
  if (!global.token) {
    fail("Cannot test sensor data - no authentication token");
    return;
  }

  for (const testCase of TEST_SENSOR_DATA) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/sensors/data`,
        testCase.data,
        {
          headers: {
            Authorization: `Bearer ${global.token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        pass(`Sensor data saved: "${testCase.name}"`);
        
        const prediction = response.data.data.prediction;
        
        if (prediction.success) {
          pass(`  → Prediction received: ${prediction.action}`);
          pass(`    Occupied: ${prediction.occupied}, Wastage: ${prediction.wastage}`);
        } else {
          log("yellow", `  ⚠ Prediction error: ${prediction.error}`);
        }
      } else {
        fail(`Sensor data save failed: ${response.data.message}`);
      }
    } catch (error) {
      fail(`Sensor data submission failed: ${error.message}`);
      testResults.errors.push(`Sensor Data: ${error.message}`);
    }
  }
}

async function testGetLatestSensorData() {
  header("Step 5: Testing Get Latest Sensor Data");
  
  if (!global.token) {
    fail("Cannot test - no authentication token");
    return;
  }

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/sensors/latest`,
      {
        headers: {
          Authorization: `Bearer ${global.token}`
        },
        timeout: 5000
      }
    );

    if (response.data.success) {
      pass(`Retrieved ${response.data.count} sensor readings`);
      
      if (response.data.count > 0) {
        const firstReading = response.data.data[0];
        pass(`  → Latest reading at: ${firstReading.timestamp}`);
      }
    } else {
      fail("Get latest data response failed");
    }
  } catch (error) {
    fail(`Get latest data failed: ${error.message}`);
    testResults.errors.push(`Get Latest: ${error.message}`);
  }
}

async function printSummary() {
  header("Test Summary");
  
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  
  if (testResults.errors.length > 0) {
    console.log(`\n${colors.yellow}Errors:${colors.reset}`);
    testResults.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }
  
  const total = testResults.passed + testResults.failed;
  const percentage = total > 0 ? ((testResults.passed / total) * 100).toFixed(0) : 0;
  
  console.log(`\n${colors.cyan}Overall: ${percentage}% Success (${testResults.passed}/${total})${colors.reset}\n`);
  
  if (testResults.failed === 0) {
    log("green", "✓ All tests passed! Integration is working correctly.");
  } else {
    log("yellow", "⚠ Some tests failed. Check configuration and logs above.");
  }
}

async function runTests() {
  console.clear();
  log("cyan", "╔════════════════════════════════════════════════════════════╗");
  log("cyan", "║     Backend to ML API Integration Test Suite               ║");
  log("cyan", "╚════════════════════════════════════════════════════════════╝");
  
  console.log(`\nBackend URL: ${BACKEND_URL}`);
  console.log(`ML API URL: ${ML_API_URL}`);
  
  await testMLAPIHealth();
  await testBackendHealth();
  await testUserRegistration();
  await testSensorDataWithPrediction();
  await testGetLatestSensorData();
  await printSummary();
  
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  log("red", `\nFatal error: ${error.message}`);
  process.exit(1);
});
