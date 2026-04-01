# ML API - Smart Energy Prediction Service

This Flask API provides machine learning predictions for energy wastage detection based on sensor data.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or create a virtual environment:

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Train the Model (if not already trained)

```bash
cd ../ml-model
pip install -r requirements.txt
python generate_ml_dataset.py  # Generate training data
python train_model.py           # Train the model
```

This creates `model.pkl` in the ml-model directory.

### 3. Run the API

```bash
python app.py
```

The API will start on `http://localhost:6000`

## Endpoints

### POST /predict

Predicts energy wastage based on sensor input.

**Request:**

```json
{
  "motion": 0,
  "current": 1.2,
  "temperature": 28,
  "voltage": 230
}
```

**Response (Success):**

```json
{
  "success": true,
  "occupied": 0,
  "wastage": 1,
  "action": "Turn OFF Fan"
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Missing required fields: current, voltage"
}
```

### GET /health

Health check endpoint to verify API is running and model is loaded.

**Response:**

```json
{
  "status": "ok",
  "model_loaded": true
}
```

## Field Descriptions

### Input Fields

- **motion** (float): Motion sensor reading (0-1 range typically)
- **current** (float): Electrical current in Amperes
- **temperature** (float): Temperature in Celsius
- **voltage** (float): Electrical voltage in Volts

### Output Fields

- **occupied** (int): 1 if space is occupied (motion > 0.5), 0 otherwise
- **wastage** (int): 1 if energy wastage detected, 0 otherwise
- **action** (string): Recommended action based on prediction
  - "Turn OFF Fan" - Device is idle, turn off
  - "Keep Fan ON" - Device is in use and running normally
  - "Normal Operation" - No wastage detected

## Environment Variables

- `FLASK_ENV`: Set to "development" or "production" (default: development)
- `FLASK_PORT`: Port for the API server (default: 6000)

## Example Usage with curl

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

## Integration with Backend

The backend calls this API at `ML_API_URL=http://localhost:6000` (configured in backend/.env)

Backend endpoint that uses this service:

- POST `/api/sensors/data` - Saves sensor data and gets prediction
