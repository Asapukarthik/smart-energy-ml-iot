const axios = require('axios');

async function testReadings() {
    try {
        const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'user@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Logged in as user');

        const readingsRes = await axios.get('http://127.0.0.1:5000/api/sensors/latest', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Readings Count for non-associated user:', readingsRes.data.count);
        if (readingsRes.data.count > 0) {
            console.log('First reading temp:', readingsRes.data.data[0].temperature);
        } else {
            console.log('No readings found!');
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testReadings();
