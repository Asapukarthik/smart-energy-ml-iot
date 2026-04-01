const axios = require("axios");

/**
 * Call Flask ML API to get predictions for sensor data
 * @param {Object} data - Sensor data with motion, current, temperature, voltage
 * @returns {Promise<Object>} Prediction result with occupied, wastage, action
 */
exports.predict = async (data) => {
    try {
        const mlApiUrl = process.env.ML_API_URL;
        
        if (!mlApiUrl) {
            console.warn("ML_API_URL not configured. Skipping prediction.");
            return {
                success: false,
                error: "ML API not configured",
                occupied: null,
                wastage: null,
                action: "N/A"
            };
        }

        // Prepare sensor data for ML API
        const sensorData = {
            occupancy: data.occupancy || 0,
            prev_occupancy: data.prev_occupancy || 0,
            ledCurrent: data.ledCurrent || 0,
            motorCurrent: data.motorCurrent || 0,
            temperature: data.temperature || 0,
            humidity: data.humidity || 0,
            voltage: data.voltage || 0,
            ledPower: data.ledPower || 0,
            motorPower: data.motorPower || 0,
            hour: new Date().getHours()  // Optional: current hour
        };

        // Call Flask ML API with timeout
        const response = await axios.post(
            `${mlApiUrl}/predict`,
            sensorData,
            {
                timeout: 5000,  // 5 second timeout
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Validate response structure
        if (response.data.status !== "success") {
            console.error("ML API returned error:", response.data.error);
            return {
                success: false,
                error: response.data.error || "Prediction failed",
                occupied: null,
                wastage: null,
                action: "N/A"
            };
        }

        // Return successful prediction
        return {
            success: true,
            occupied: response.data.occupancy,
            wastage: response.data.wastage,
            action: response.data.action,
            confidence: response.data.confidence || 1.0
        };

    } catch (error) {
        // Handle different error types
        let errorMessage = "ML API call failed";
        
        if (error.code === "ECONNREFUSED") {
            errorMessage = "ML API is not running on " + process.env.ML_API_URL;
        } else if (error.code === "ENOTFOUND") {
            errorMessage = "ML API host not found: " + process.env.ML_API_URL;
        } else if (error.code === "ECONNABORTED") {
            errorMessage = "ML API request timeout";
        } else if (error.response) {
            errorMessage = error.response.data?.error || error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        console.error("ML Service Error:", errorMessage);

        return {
            success: false,
            error: errorMessage,
            occupied: null,
            wastage: null,
            action: "N/A"
        };
    }
};