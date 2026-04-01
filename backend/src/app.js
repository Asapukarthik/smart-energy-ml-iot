const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const authRoutes = require("./routes/auth.routes");
const sensorRoutes = require("./routes/sensor.routes");
const deviceRoutes = require("./routes/device.routes");

const app = express();

// Ensure JWT_SECRET is set before connecting
if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET environment variable not set. Please set it before running in production.");
}

// Log ML API configuration
if (process.env.ML_API_URL) {
    console.log(`ML API configured at: ${process.env.ML_API_URL}`);
} else {
    console.warn("Warning: ML_API_URL not configured. Predictions will not be available.");
}

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/device", deviceRoutes);

module.exports = app;