const axios = require('axios');

async function testAuth() {
    try {
        const adminRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Admin Role Check:', adminRes.data.user.role);

        const userRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'user@example.com',
            password: 'password123'
        });
        console.log('User Role Check:', userRes.data.user.role);
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAuth();
