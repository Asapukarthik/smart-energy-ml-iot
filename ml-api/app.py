from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml-model", "model.pkl")

try:
    model_data = joblib.load(MODEL_PATH)
    occupancy_model = model_data["occupancy_model"]
    wastage_model = model_data["wastage_model"] # Loaded but rule-based detection takes precedence
    features_occ = model_data["features_occ"]
    print(f"Models loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    occupancy_model = None

@app.route('/predict', methods=['POST'])
def predict():
    if not occupancy_model:
        return jsonify({"error": "Model not loaded", "status": "error"}), 500

    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ["temperature", "humidity", "occupancy", "ledCurrent", "motorCurrent", "voltage", "prev_occupancy", "hour"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}", "status": "error"}), 400

        # Extract features for occupancy prediction (purely analytical now)
        input_data = pd.DataFrame([{
            "hour": data["hour"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "voltage": data["voltage"],
            "prev_occupancy": data["prev_occupancy"]
        }])

        # Predict occupancy
        occupancy_prediction = int(occupancy_model.predict(input_data)[0])

        # Hardware occupancy takes precedence for wastage
        hardware_occupancy = int(data["occupancy"])
        led_current = float(data["ledCurrent"])
        motor_current = float(data["motorCurrent"])

        # Wastage detection based on rules:
        wastage_prediction = 1 if hardware_occupancy == 0 and (led_current > 0.05 or motor_current > 0.1) else 0

        # Suggested action
        action = "Turn off unnecessary appliances" if wastage_prediction == 1 else "No action required"

        return jsonify({
            "occupancy": occupancy_prediction,
            "wastage": wastage_prediction,
            "action": action,
            "status": "success",
            "input_received": data
        })

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "models_loaded": occupancy_model is not None})

if __name__ == '__main__':
    # Run on port 6000 (Node.js backend uses 5000)
    app.run(host='0.0.0.0', port=6000, debug=True)
