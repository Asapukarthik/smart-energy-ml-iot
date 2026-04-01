const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    temperature: Number,
    humidity: Number,
    occupancy: Number,
    ledCurrent: Number,
    motorCurrent: Number,
    voltage: Number,
    ledPower: Number,
    motorPower: Number,
    lightStatus: Boolean,
    fanStatus: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("SensorData", SensorSchema);