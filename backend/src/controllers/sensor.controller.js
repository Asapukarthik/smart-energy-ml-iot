const Sensor = require("../models/sensor.model");
const Device = require("../models/device.model");
const mlService = require("../services/ml.service");

/**
 * Save sensor data and get ML prediction
 * @route POST /api/sensors/data
 * @access Private
 */
exports.saveSensorData = async (req, res) => {
    try {
        // Validate required fields
        const required = ['occupancy', 'ledCurrent', 'motorCurrent', 'temperature', 'voltage', 'humidity'];
        const missing = required.filter(field => req.body[field] === undefined);
        
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required sensor fields: ${missing.join(', ')}`
            });
        }

        // 1. Get current device status from DB (Shared across users)
        let device = await Device.findOne({});
        if (!device) {
            device = await Device.create({
                userId: req.user.id, // Record which user created it, but status is shared
                light: !!req.body.lightStatus,
                fan: !!req.body.fanStatus
            });
        }

        // 2. Save sensor data to database
        // First get the most recent sensor reading to capture chronological prev_occupancy state
        const lastSensor = await Sensor.findOne({ userId: req.user.id }).sort({ timestamp: -1 });
        const prev_occupancy = lastSensor ? lastSensor.occupancy : 0;
        
        // Inject prev_occupancy into req.body so mlService can use it
        req.body.prev_occupancy = prev_occupancy;

        const sensorData = await Sensor.create({
            ...req.body,
            userId: req.user.id,
            lightStatus: device.light,
            fanStatus: device.fan
        });

        // 3. Get ML prediction
        const prediction = await mlService.predict(req.body);

        // 4. ML Control Logic: AUTO-OVERRIDE if wastage is high
        let overrideApplied = false;
        if (prediction.success && prediction.wastage === 1) {
            // Force devices off in the database if wastage detected
            device.light = false;
            device.fan = false;
            device.updatedAt = Date.now();
            await device.save();
            overrideApplied = true;
        }

        // 5. Return authoritative data and commands to ESP32
        res.status(201).json({
            success: true,
            message: overrideApplied ? "Wastage detected - auto-correction applied" : "Sensor data stored",
            data: {
                sensor: sensorData,
                prediction: prediction,
                commands: {
                    light: device.light,
                    fan: device.fan
                }
            }
        });

    } catch (error) {
        console.error("Save sensor data error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error saving sensor data"
        });
    }
};

/**
 * Get latest sensor data for user
 * @route GET /api/sensors/latest
 * @access Private
 */
exports.getLatestData = async (req, res) => {
    try {
        const data = await Sensor
            .find({})
            .sort({ timestamp: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        console.error("Get latest data error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error retrieving sensor data"
        });
    }
};