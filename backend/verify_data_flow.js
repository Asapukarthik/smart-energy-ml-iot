const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000/api';
const TEST_USER = {
    name: 'Verifier',
    email: 'verify@example.com',
    password: 'Password123!'
};

async function verify() {
    console.log('--- Verification Started ---');

    try {
        // 1. Register User
        console.log('1. Registering user...');
        let authRes;
        try {
            authRes = await axios.post(`${BACKEND_URL}/auth/register`, TEST_USER);
            console.log('   User registered successfully.');
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message && e.response.data.message.includes('already registered')) {
                console.log('   User already exists, logging in...');
                authRes = await axios.post(`${BACKEND_URL}/auth/login`, {
                    email: TEST_USER.email,
                    password: TEST_USER.password
                });
            } else {
                console.error('   Registration/Login Failed:', e.response ? e.response.data : e.message);
                throw e;
            }
        }
        const token = authRes.data.token;

        // 2. Post Sensor Data
        console.log('2. Posting sensor data...');
        const sensorData = {
            motion: 1,
            current: 2.5,
            temperature: 24,
            voltage: 232,
            lightStatus: true,
            fanStatus: false
        };
        const postRes = await axios.post(`${BACKEND_URL}/sensors/data`, sensorData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (postRes.data.success) {
            console.log('   Sensor data posted successfully.');
            console.log('   ML Prediction:', postRes.data.data.prediction.action);
        } else {
            console.error('   Failed to post sensor data:', postRes.data.message);
            return;
        }

        // 3. Retrieve Latest Data (Frontend style)
        console.log('3. Retrieving latest data...');
        const getRes = await axios.get(`${BACKEND_URL}/sensors/latest`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (getRes.data.success && getRes.data.data.length > 0) {
            const latest = getRes.data.data[0];
            console.log('   Successfully retrieved latest data!');
            console.log('   Retrieved Values:', {
                temperature: latest.temperature,
                voltage: latest.voltage,
                current: latest.current,
                motion: latest.motion
            });
            console.log('--- Verification PASSED ---');
        } else {
            console.error('   No data found in latest endpoint.');
        }

    } catch (error) {
        console.error('--- Verification FAILED ---');
        console.error(error.response ? error.response.data : error.message);
    }
}

verify();
