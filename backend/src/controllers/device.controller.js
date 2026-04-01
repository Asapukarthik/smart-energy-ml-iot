const Device = require("../models/device.model");

exports.updateDevice = async (req, res) => {
    // Only admin can change device state
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only admin can operate devices."
        });
    }

    const device = await Device.findOneAndUpdate(
        {}, // Global state
        req.body,
        { new: true, upsert: true }
    );

    res.json(device);
};


exports.getDeviceStatus = async (req, res) => {
    // Return global device status to any authenticated user
    const device = await Device.findOne({});

    res.json(device);
};