const BACKEND_URL = 'http://localhost:5000/api';
const LOGIN_CREDENTIALS = {
    email: 'user@example.com',
    password: 'password123' // default seeded user
};

// Configuration
const INTERVAL_MS = 5000; // 5 seconds

// Helper to generate a random number between min and max
const randomInRange = (min, max) => (Math.random() * (max - min) + min);

// Initial State for realistic smooth data drifting
let state = {
    temperature: 24.5,
    humidity: 45.0,
    voltage: 5.0,
    occupancyStatus: true,
    occupancyTicks: 0 // How long we've been in the current state
};

async function simulate() {
    console.log('--- Starting Realistic Hardware Simulation ---');
    console.log(`Interval: Every ${INTERVAL_MS / 1000} seconds`);

    try {
        // 1. Authenticate to get the Bearer token
        console.log(`Authenticating as ${LOGIN_CREDENTIALS.email}...`);
        const authRes = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(LOGIN_CREDENTIALS)
        });
        
        const authData = await authRes.json();
        if (!authRes.ok) throw new Error(authData.message || JSON.stringify(authData));
        
        const token = authData.token;
        console.log('Authentication successful! \n');

        // 2. Start the simulation loop
        setInterval(async () => {
            // Smoothly drift temperature and humidity
            state.temperature += randomInRange(-0.2, 0.2);
            state.temperature = Math.max(15, Math.min(35, state.temperature)); // Clamp between 15C and 35C

            state.humidity += randomInRange(-1, 1);
            state.humidity = Math.max(20, Math.min(80, state.humidity)); // Clamp humidity

            state.voltage += randomInRange(-0.02, 0.02);
            state.voltage = Math.max(4.8, Math.min(5.2, state.voltage));

            // Occupancy naturally stays for a while, then changes
            state.occupancyTicks++;
            if (state.occupancyTicks > 12) { // Every ~1 min
                if (Math.random() > 0.7) { 
                    state.occupancyStatus = !state.occupancyStatus;
                    state.occupancyTicks = 0;
                }
            }
            
            const isOccupied = state.occupancyStatus ? 1 : 0; 

            // Current depends on occupancy and random variance
            const ledCurrent = isOccupied ? randomInRange(0.02, 0.04) : randomInRange(0.01, 0.015);
            const motorCurrent = isOccupied ? randomInRange(0.2, 0.3) : randomInRange(0.05, 0.1);

            const sensorData = {
                timestamp: new Date().toISOString(), // Adding real-time ISO timestamp format
                occupancy: isOccupied,
                ledCurrent: parseFloat(ledCurrent.toFixed(3)),
                motorCurrent: parseFloat(motorCurrent.toFixed(3)),
                temperature: parseFloat(state.temperature.toFixed(2)),
                voltage: parseFloat(state.voltage.toFixed(2)),
                humidity: parseFloat(state.humidity.toFixed(2)),
                lightStatus: state.occupancyStatus, // Simulated light on if occupied
                fanStatus: state.occupancyStatus    // Simulated fan on if occupied
            };

            console.log(`[${new Date().toLocaleTimeString()}] Sending sensor data:`);
            console.log(sensorData);

            try {
                // Post to the backend
                const postRes = await fetch(`${BACKEND_URL}/sensors/data`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(sensorData)
                });
                
                const postData = await postRes.json();

                if (postRes.ok && postData.success) {
                    const prediction = postData.data.prediction;
                    if (prediction) {
                        console.log('✅ Data sent successfully.');
                        console.log(`   ML Action: ${prediction.action}`);
                        console.log(`   Wastage: ${prediction.wastage === 1 ? 'Yes' : 'No'}\n`);
                    } else {
                         console.log('✅ Data sent successfully (No prediction data returned).\n');
                    }
                } else {
                    console.error('❌ Failed to send sensor data:');
                    console.error(postData, '\n');
                }
            } catch (postError) {
                console.error('❌ Network error sending sensor data:');
                console.error(postError.message, '\n');
            }

        }, INTERVAL_MS);

    } catch (error) {
        console.error('--- Setup Failed ---');
        console.error('Could not authenticate. Are you sure the backend is running and the database is seeded?');
        console.error(error.message);
        process.exit(1);
    }
}

simulate();
