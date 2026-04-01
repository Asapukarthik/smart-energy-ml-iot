# Backend to ML API Integration Documentation

## Overview

The Node.js backend has been updated to communicate with the Flask ML API for real-time energy wastage predictions. This document explains the integration, API contracts, and troubleshooting.

## Configuration

### Environment Variables

Add these to your `backend/.env` file:

```bash
# ML API endpoint (Flask API should be running on port 8000)
ML_API_URL=http://localhost:8000
```

### Required Setup

1. **Flask ML API must be running** on `http://localhost:8000`
2. **Backend will log** ML API configuration on startup

## API Architecture

### Backend Routes

#### POST /api/sensors/data

Save sensor data and get ML prediction

**Request:**

```json
{
  "motion": 0,
  "current": 1.2,
  "temperature": 28,
  "voltage": 230,
  "lightStatus": false,
  "fanStatus": false
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Sensor data stored",
  "data": {
    "sensor": {
      "_id": "507f1f77bcf86cd799439011",
      "motion": 0,
      "temperature": 28,
      "current": 1.2,
      "voltage": 230,
      "lightStatus": false,
      "fanStatus": false,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "prediction": {
      "success": true,
      "occupied": 0,
      "wastage": 1,
      "action": "Turn OFF Fan",
      "confidence": {
        "occupancy": 0.85,
        "wastage": 0.82
      }
    }
  }
}
```

**Response (ML API Error):**

```json
{
  "success": true,
  "message": "Sensor data stored",
  "data": {
    "sensor": { ... },
    "prediction": {
      "success": false,
      "error": "ML API is not running on http://localhost:8000",
      "occupied": null,
      "wastage": null,
      "action": "N/A"
    }
  }
}
```

#### GET /api/sensors/latest

Get latest sensor readings for user

**Response:**

```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "motion": 0,
      "temperature": 28,
      "current": 1.2,
      "voltage": 230,
      "lightStatus": false,
      "fanStatus": false,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Service Layer

### ml.service.js

The `ml.service.js` file handles communication with the Flask ML API.

**Usage:**

```javascript
const mlService = require("../services/ml.service");

const prediction = await mlService.predict({
  motion: 0,
  current: 1.2,
  temperature: 28,
  voltage: 230,
});

// Returns:
// {
//   success: true/false,
//   occupied: 0/1 or null,
//   wastage: 0/1 or null,
//   action: "Turn OFF Fan" / "Keep Fan ON" / "Normal Operation" / "N/A",
//   error?: "error message"
// }
```

**Implementation Details:**

- Sends sensor data to `${ML_API_URL}/predict`
- Includes optional hour field (current hour of day)
- 5-second timeout for ML API requests
- Graceful error handling with descriptive messages

**Error Handling:**

- Connection refused → "ML API is not running..."
- Host not found → "ML API host not found..."
- Request timeout → "ML API request timeout"
- API error response → Returns error from API
- Other errors → Returns generic error message

## Data Flow Diagram

```
Frontend
  │
  ├─→ POST /api/sensors/data (with sensor readings)
       │
MongoDB  ←─ Sensor Data Saved
  │      │
Sensor   ├─→ ML Service calls Flask API
Controller    │
  │           └─→ POST http://localhost:8000/predict
  │                 │
  │            Flask ML API
  │                 │
  │            Runs 2 Models:
  │            1. Occupancy Detection
  │            2. Wastage Detection
  │                 │
  │            Returns Prediction
  │                 │
  ├─────────────────┘
  │
Response ← { sensor data + prediction }
  │
Frontend ← Display prediction & sensor data
```

## Error Scenarios

### 1. ML API Not Running

**Backend logs:**

```
ML Service Error: ML API is not running on http://localhost:8000
```

**Response includes:**

```json
"prediction": {
  "success": false,
  "error": "ML API is not running on http://localhost:8000",
  "occupied": null,
  "wastage": null,
  "action": "N/A"
}
```

**Solution:** Start Flask API: `python ml-api/app.py`

### 2. Missing Sensor Data

**Backend logs:**

```
Save sensor data error: Missing required sensor fields...
```

**Response:**

```json
{
  "success": false,
  "message": "Missing required sensor fields: motion, current, temperature, voltage"
}
```

**Solution:** Ensure all required fields are sent in request

### 3. ML API Returns Error

**Backend logs:**

```
ML API returned error: Invalid data types...
```

**Response includes:**

```json
"prediction": {
  "success": false,
  "error": "Invalid data types...",
  "occupied": null,
  "wastage": null,
  "action": "N/A"
}
```

**Solution:** Check sensor data values are valid numbers

## Testing

### Test with curl

```bash
# Make sure you're authenticated first (get a token from login)
TOKEN="your_jwt_token_here"

# Send sensor data
curl -X POST http://localhost:5000/api/sensors/data \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "motion": 0,
    "current": 1.2,
    "temperature": 28,
    "voltage": 230,
    "lightStatus": false,
    "fanStatus": false
  }'

# Get latest sensor data
curl -X GET http://localhost:5000/api/sensors/latest \
  -H "Authorization: Bearer ${TOKEN}"
```

### Test with Postman

1. Create new POST request to `http://localhost:5000/api/sensors/data`
2. Add Authorization header: `Bearer your_token_here`
3. Set Content-Type to `application/json`
4. Send body with sensor data
5. View response with prediction

## Debugging

### Enable Debug Logging

The service logs errors to console. Check:

```bash
# Terminal where backend is running
# Look for these log messages:

# On startup:
ML API configured at: http://localhost:8000

# On prediction:
ML Service Error: ...  (if there's an error)
```

### Check ML API Health

```bash
curl http://localhost:8000/health
```

**Expected response:**

```json
{
  "status": "ok",
  "models_loaded": true
}
```

### Verify Network Connectivity

```bash
# Test connection to ML API
ping localhost:8000

# Or use Node
node -e "
  const axios = require('axios');
  axios.get('http://localhost:8000/health')
    .then(r => console.log('Connected:', r.data))
    .catch(e => console.log('Error:', e.message));
"
```

## Performance Considerations

| Metric             | Value     |
| ------------------ | --------- |
| Prediction Latency | 100-500ms |
| Total Request Time | 150-550ms |
| DB Save Time       | 10-50ms   |
| ML API Call Time   | 100-500ms |

**Optimization Tips:**

- Batch predictions if possible
- Cache predictions for repeated sensor values
- Implement rate limiting on frontend
- Consider async jobs for non-real-time processing

## Troubleshooting Checklist

- [ ] Is Flask ML API running on port 8000?
- [ ] Is MongoDB running?
- [ ] Is backend running?
- [ ] Are all required fields sent in request?
- [ ] Is `ML_API_URL` set in `.env`?
- [ ] Are field values valid numbers?
- [ ] Check logs for connection errors
- [ ] Verify JWT token is valid (for authentication)

## File Structure

```
backend/
├── .env                           # Configure ML_API_URL
├── .env.example                   # Template
├── server.js
├── src/
│   ├── app.js                     # Contains ML API logging
│   ├── services/
│   │   └── ml.service.js          # ML API communication ⭐
│   ├── controllers/
│   │   └── sensor.controller.js   # Uses ml.service.js ⭐
│   └── routes/
│       └── sensor.routes.js
```

## API Contracts

### Input to ML API

```javascript
{
  motion: number,        // 0 or 1
  current: number,       // Float (Amperes)
  temperature: number,   // Float (Celsius)
  voltage: number,       // Float (Volts)
  hour: number          // Optional, 0-23
}
```

### Output from ML API

```javascript
{
  success: boolean,
  occupied: number,      // 0 or 1
  wastage: number,       // 0 or 1
  action: string,        // "Turn OFF Fan" / "Keep Fan ON" / "Normal Operation"
  confidence: {
    occupancy: number,   // 0-1
    wastage: number      // 0-1
  }
}
```

## Next Steps

1. **Start ML API:** `cd ml-api && python app.py`
2. **Start Backend:** `cd backend && npm run dev`
3. **Test Integration:** Use curl or Postman
4. **Monitor Logs:** Check console for errors
5. **Deploy:** Configure ML_API_URL for production

## Support

- Check logs for error messages
- Verify ML API is running with `/health` endpoint
- Ensure sensor data contains valid numbers
- Check network connectivity between services
- Review error response structure

## Related Documentation

- Backend README: `backend/README.md`
- ML API Documentation: `ml-api/README.md`
- Setup Guide: `ML_SETUP_GUIDE.md`
- Complete Deliverables: `COMPLETE_DELIVERABLES.md`
