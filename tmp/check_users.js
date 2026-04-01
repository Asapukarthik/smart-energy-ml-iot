const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_energy_iot');
        console.log('MongoDB Connected');
        
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String
        }));
        
        const users = await User.find();
        console.log('Users in DB:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));
        
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

checkUsers();
