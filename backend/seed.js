const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Sensor = require('./src/models/sensor.model');
const Device = require('./src/models/device.model');
require('dotenv').config();

const ADMIN_USER = {
    name: 'Karthik Asapu',
    email: 'karthikasapu21@gmail.com',
    password: 'Karthik@#0121',
    role: 'admin'
};

const REGULAR_USER = {
    name: 'Smart User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
};

async function seed() {
    try {
        console.log('--- Database Seeding Started ---');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_energy_iot');
        console.log('MongoDB Connected');

        // 1. Create/Find Admin
        let admin = await User.findOne({ email: ADMIN_USER.email });
        if (!admin) {
            console.log('Creating admin user...');
            admin = await User.create(ADMIN_USER);
        }

        // 2. Create/Find Regular User
        let user = await User.findOne({ email: REGULAR_USER.email });
        if (!user) {
            console.log('Creating regular user...');
            user = await User.create(REGULAR_USER);
        }

        // 3. Initialize GLOBAL Device Status (Shared)
        console.log('Initializing global device states...');
        await Device.findOneAndUpdate(
            {}, // Global state
            { light: false, fan: true, userId: admin._id },
            { upsert: true, new: true }
        );

        // 4. Generate Historical Sensor Data
        console.log('Generating historical sensor data...');
        // Clear all previous data to start fresh for global view
        await Sensor.deleteMany({}); 
        
        const now = new Date();
        const sensorEntries = [];
        
        for (let i = 0; i < 50; i++) {
            const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000));
            
            const ledCurrent = 0.01 + Math.random() * 0.04;
            const motorCurrent = 0.1 + Math.random() * 0.3;
            const voltage = 4.8 + Math.random() * 0.4;
            
            sensorEntries.push({
                userId: admin._id,
                temperature: 22 + Math.random() * 5,
                humidity: 40 + Math.random() * 30,
                occupancy: Math.random() > 0.7 ? 1 : 0,
                ledCurrent: ledCurrent,
                motorCurrent: motorCurrent,
                voltage: voltage,
                ledPower: ledCurrent * voltage,
                motorPower: motorCurrent * voltage,
                lightStatus: Math.random() > 0.5,
                fanStatus: Math.random() > 0.5,
                timestamp: timestamp
            });
        }
        
        await Sensor.insertMany(sensorEntries);
        console.log(`Successfully seeded ${sensorEntries.length} sensor records.`);
        console.log('--- Seeding PASSED ---');
        console.log('Admin login: karthikasapu21@gmail.com / Karthik@#0121');
        console.log('User login: user@example.com / password123');

    } catch (error) {
        console.error('--- Seeding FAILED ---');
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

seed();
