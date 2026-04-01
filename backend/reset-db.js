const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB.");

        // Drop sensors collection
        await mongoose.connection.db.dropCollection("sensordatas");
        console.log("Sensors collection dropped.");
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        // Maybe collection didn't exist
        process.exit(0);
    }
}

run();
