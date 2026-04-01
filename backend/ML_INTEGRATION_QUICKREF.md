# Backend ML API Integration - Quick Reference

## ⚡ TL;DR

1. **Flask ML API must be running on port 8000**
2. **Backend calls ML API automatically** when sensor data is sent
3. **Predictions included in response** alongside sensor data
4. **Errors handled gracefully** - returns prediction null if ML API fails

## 🚀 Start Everything

### Terminal 1: MongoDB

```bash
mongod
# or use Atlas cloud MongoDB
```

### Terminal 2: ML API

```bash
cd ml-api
pip install -r requirements.txt
python app.py
# Running on http://localhost:8000
```

### Terminal 3: Backend

```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### Terminal 4: Frontend (optional)

```bash
cd dashboard
npm install
npm run dev
# Running on http://localhost:3000
```

## 📝 Configuration

**File:** `backend/.env`

```bash
# Required for ML integration
ML_API_URL=http://localhost:8000

# Other configs...
MONGODB_URI=mongodb://127.0.0.1:27017/smart_energy_iot
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

## 📊 Data Flow

### Send Sensor Data

```bash
curl -X POST http://localhost:5000/api/sensors/data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "motion": 0,
    "current": 1.2,
    "temperature": 28,
    "voltage": 230,
    "lightStatus": false,
    "fanStatus": false
  }'
```

### Response

```json
{
  "success": true,
  "message": "Sensor data stored",
  "data": {
    "sensor": {
      "_id": "...",
      "motion": 0,
      "current": 1.2,
      "temperature": 28,
      "voltage": 230,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "prediction": {
      "success": true,
      "occupied": 0,
      "wastage": 1,
      "action": "Turn OFF Fan"
    }
  }
}
```

## 🔧 ML Service API

**File:** `backend/src/services/ml.service.js`

```javascript
const mlService = require("../services/ml.service");

// Call ML API for prediction
const prediction = await mlService.predict({
  motion: 0,
  current: 1.2,
  temperature: 28,
  voltage: 230,
});

// Returns:
// {
//   success: true,
//   occupied: 0,
//   wastage: 1,
//   action: "Turn OFF Fan",
//   confidence: { occupancy: 0.85, wastage: 0.82 }
// }
```

## ✅ Test Integration

### Check ML API is Running

```bash
curl http://localhost:8000/health
# Expected: {"status": "ok", "models_loaded": true}
```

### Check Backend Logs

```
# Look for:
ML API configured at: http://localhost:8000
```

### Make Test Request

```bash
# 1. Get auth token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Use token to send sensor data
curl -X POST http://localhost:5000/api/sensors/data \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"motion": 0, "current": 1.2, "temperature": 28, "voltage": 230}'
```

## 🐛 Troubleshooting

| Issue                   | Solution                                |
| ----------------------- | --------------------------------------- |
| `Connection refused`    | Start ML API: `python ml-api/app.py`    |
| `ML API not configured` | Set `ML_API_URL` in `.env`              |
| `404 Not Found`         | Ensure backend is running on port 5000  |
| `401 Unauthorized`      | Include valid JWT token in header       |
| `Prediction is null`    | Check ML API logs, ensure models loaded |

## 📂 Key Files

| File                                           | Purpose            |
| ---------------------------------------------- | ------------------ |
| `backend/.env`                                 | Configuration      |
| `backend/src/services/ml.service.js`           | ML API calls       |
| `backend/src/controllers/sensor.controller.js` | Endpoint handlers  |
| `backend/src/routes/sensor.routes.js`          | Route definitions  |
| `backend/ML_API_INTEGRATION.md`                | Full documentation |

## 🔌 API Endpoints

| Method | Endpoint              | Purpose                      |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/auth/login`     | Get JWT token                |
| POST   | `/api/sensors/data`   | Send sensor + get prediction |
| GET    | `/api/sensors/latest` | Get last 50 readings         |

## 📊 Response Structure

### Successful Prediction

```json
{
  "success": true,
  "occupied": 0, // 0=not occupied, 1=occupied
  "wastage": 1, // 0=normal, 1=wastage detected
  "action": "Turn OFF Fan",
  "confidence": {
    "occupancy": 0.85,
    "wastage": 0.82
  }
}
```

### ML API Error (but data saved)

```json
{
  "success": false,
  "error": "ML API is not running on http://localhost:8000",
  "occupied": null,
  "wastage": null,
  "action": "N/A"
}
```

## 💡 Tips

1. **Always check ML API status** at startup
2. **Watch backend logs** for connection errors
3. **Include all required fields** in sensor data
4. **Use valid JWT tokens** for protected routes
5. **Validate sensor values** are reasonable numbers
6. **Handle null predictions** in frontend gracefully

## 🚀 Deployment

### Production Setup

```bash
# 1. Set environment variables
export ML_API_URL=http://ml-api-server:8000
export MONGODB_URI=mongodb://db-server:27017/...
export JWT_SECRET=strong_random_key_here

# 2. Run with PM2 (or your process manager)
pm2 start server.js --name "backend"
```

## 📞 Support

- Check logs: `node server.js` console output
- ML API status: `curl http://localhost:8000/health`
- Backend status: `curl http://localhost:5000/api/auth/login`
- See full docs: `backend/ML_API_INTEGRATION.md`

---

**Status:** ✅ Ready to use  
**Last Updated:** 2024  
**Integration:** Node.js Backend ↔️ Flask ML API
