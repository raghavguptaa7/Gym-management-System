const mongoose = require('mongoose');
require('dotenv').config(); // Ensures .env variables are loaded

const connectDB = async () => {
    try {
        // This line forces the app to use your MONGO_URI from the environment
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`DB connection successful! Host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`DB Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
