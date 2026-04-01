# Smart Energy ML - Complete Setup Guide

This guide covers setting up and running the entire machine learning pipeline for the Smart Energy IoT system.

## Project Structure

```
ml-model/           # Training scripts and trained models
  ├── dataset.csv         # Generated training dataset
  ├── model.pkl           # Trained ML models (binary)
  ├── train_model.py      # Model training script
  ├── generate_ml_dataset.py  # Data generation script
  └── requirements.txt     # Python dependencies for training

ml-api/             # Flask REST API for predictions
  ├── app.py              # Flask API server
  ├── requirements.txt     # Python dependencies for API
  ├── .env                # API environment configuration
  ├── .env.example        # Environment template
  └── README.md           # API documentation
```

## Prerequisites

- Python 3.8+ installed
- pip package manager
- Virtual environment (recommended)

## Setup Steps

### Step 1: Create Virtual Environment (Optional but Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Generate Training Data

```bash
cd ml-model

# Install dependencies
pip install -r requirements.txt

# Generate dataset
python generate_ml_dataset.py
```

**Output:** Creates `dataset.csv` with 1500 rows of sensor data.

### Step 3: Train ML Models

```bash
# Still in ml-model directory
python train_model.py
```

**Output:**

- Trains two models: Occupancy Detection and Energy Wastage Detection
- Saves as `model.pkl` (~2-5 MB)
- Shows accuracy metrics for both models

**Expected Output:**

```
Decision Tree Accuracy (Occupancy): 0.8234
Random Forest Accuracy (Wastage): 0.7892
Models saved successfully to model.pkl
```

### Step 4: Setup ML API

```bash
cd ../ml-api

# Install dependencies
pip install -r requirements.txt

# The .env file should already be configured with:
# - FLASK_ENV=development
# - FLASK_PORT=6000
```

### Step 5: Start ML API Server

```bash
# From ml-api directory
python app.py
```

**Expected Output:**

```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:6000
```

## Testing the API

### Health Check

```bash
curl http://localhost:6000/health
```

**Response:**

```json
{
  "status": "ok",
  "models_loaded": true
}
```

### Make a Prediction

```bash
curl -X POST http://localhost:6000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "motion": 0,
    "current": 1.2,
    "temperature": 28,
    "voltage": 230
  }'
```

**Response:**

```json
{
  "success": true,
  "occupied": 0,
  "wastage": 1,
  "action": "Turn OFF Fan"
}
```

## Model Details

### Occupancy Detection Model

- **Type:** Decision Tree Classifier
- **Features Used:** hour, motion, temperature, voltage
- **Output:** 0 (not occupied) or 1 (occupied)
- **Purpose:** Determine if the space is currently in use

### Energy Wastage Detection Model

- **Type:** Random Forest Classifier
- **Features Used:** hour, current, voltage, occupied
- **Output:** 0 (no wastage) or 1 (wastage detected)
- **Purpose:** Identify unnecessary energy consumption

## API Endpoints

### POST /predict

- **Purpose:** Predict occupancy and energy wastage
- **Input:** motion, current, temperature, voltage (optional: hour)
- **Output:** occupied, wastage, action
- **Status Codes:** 200 (success), 400 (validation error), 500 (server error)

### GET /health

- **Purpose:** Check API health and model status
- **Output:** status, models_loaded
- **Status Code:** 200

## Troubleshooting

### Models not loading

```
Error: Model file not found at [...]/model.pkl
```

**Solution:** Run `python train_model.py` in ml-model directory

### Module not found errors

```
ModuleNotFoundError: No module named 'flask'
```

**Solution:** Install dependencies: `pip install -r requirements.txt`

### Port already in use

```
Address already in use
```

**Solution:** Change FLASK_PORT in `.env` file or kill process on port 6000

### Permission denied

```
PermissionError: [Errno 13] Permission denied
```

**Solution:** Ensure you have read permissions on dataset.csv and model.pkl

## Integration with Backend

The backend service calls this ML API at:

```
ML_API_URL=http://localhost:6000
```

When a sensor reading is received, the backend calls:

```
POST http://localhost:6000/predict
```

With the latest sensor data and stores the prediction result.

## Retraining Models

To retrain with newer data:

```bash
cd ml-model

# Generate new data
python generate_ml_dataset.py

# Train new models
python train_model.py

# Restart ML API
# (in another terminal)
cd ../ml-api
python app.py
```

## Production Deployment

For production:

1. Set `FLASK_ENV=production` in `.env`
2. Set `debug=False` in app.py or via environment
3. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:6000 app:app
   ```
4. Use a reverse proxy (nginx) in front
5. Monitor logs and API responses
6. Set up periodic model retraining

## Performance Metrics

- **Prediction Latency:** ~0.1-0.5 seconds
- **Models Loaded:** 2 (Occupancy + Wastage)
- **Memory Usage:** ~50-100 MB
- **Typical Accuracy:** 78-85% (varies with data)

## Next Steps

1. ✅ Generate dataset
2. ✅ Train models
3. ✅ Start API
4. ✅ Test endpoints
5. **→** Start backend service
6. **→** Connect frontend dashboard
7. **→** Deploy to production
