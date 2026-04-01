const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const controller = require("../controllers/sensor.controller");

router.post("/data", protect, controller.saveSensorData);

router.get("/latest", protect, controller.getLatestData);

module.exports = router;