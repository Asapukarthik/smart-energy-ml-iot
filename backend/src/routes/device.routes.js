const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const controller = require("../controllers/device.controller");

router.post("/update", protect, controller.updateDevice);

router.get("/status", protect, controller.getDeviceStatus);

module.exports = router;