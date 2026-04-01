# Quick Start - ML Pipeline

## 🚀 One-Time Setup

```bash
# 1. Navigate to ml-model
cd ml-model

# 2. Install dependencies
pip install -r requirements.txt

# 3. Generate training data
python generate_ml_dataset.py

# 4. Train models
python train_model.py

# Output: model.pkl created
```

## ▶️ Start ML API (Every Time)

```bash
# From project root
cd ml-api

# Install dependencies (if not already done)
pip install -r requirements.txt

# Start API server
python app.py

# API will run on http://localhost:6000
```

## 🧪 Test ML API

```bash
# Health check
curl http://localhost:6000/health

# Sample prediction
curl -X POST http://localhost:6000/predict \
  -H "Content-Type: application/json" \
  -d '{"motion": 0, "current": 1.2, "temperature": 28, "voltage": 230}'
```

## 📋 Expected Response

```json
{
  "success": true,
  "occupied": 0,
  "wastage": 1,
  "action": "Turn OFF Fan"
}
```

## 🔧 Files Created/Updated

✅ **ml-api/app.py** - Flask API with dual model support
✅ **ml-api/requirements.txt** - API dependencies
✅ **ml-api/README.md** - API documentation
✅ **ml-api/.env** - API configuration
✅ **ml-api/.env.example** - Config template
✅ **ml-model/requirements.txt** - Training dependencies
✅ **ML_SETUP_GUIDE.md** - Comprehensive setup guide

## ⚠️ Troubleshooting

| Issue                 | Solution                                        |
| --------------------- | ----------------------------------------------- |
| `model.pkl not found` | Run `python train_model.py` in ml-model         |
| `Flask not found`     | Run `pip install -r requirements.txt` in ml-api |
| `Port 6000 in use`    | Change `FLASK_PORT` in ml-api/.env              |
| `PermissionError`     | Check file permissions on model.pkl             |

## 📚 Model Details

**Occupancy Model:**

- Type: Decision Tree
- Input: hour, motion, temperature, voltage
- Output: 0/1 (not occupied/occupied)

**Wastage Model:**

- Type: Random Forest (100 trees)
- Input: hour, current, voltage, occupied
- Output: 0/1 (no wastage/wastage detected)

**Prediction Logic:**

- If wastage detected and occupied → "Keep Fan ON"
- If wastage detected and not occupied → "Turn OFF Fan"
- If no wastage → "Normal Operation"
