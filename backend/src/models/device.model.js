const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    light: Boolean,

    fan: Boolean,

    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Device", DeviceSchema);