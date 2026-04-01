const mongoose = require('mongoose');
const Sensor = require('./src/models/sensor.model');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_energy_iot');
        console.log('MongoDB Connected');
        
        const count = await Sensor.countDocuments();
        console.log('Total Sensor Documents:', count);
        
        if (count > 0) {
            const data = await Sensor.find().limit(5).sort({ timestamp: -1 });
            console.log('Latest 5 entries:', JSON.stringify(data, null, 2));
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

checkDB();
