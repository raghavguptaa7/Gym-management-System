const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

// Connect to Database by simply requiring the file
require('./DBConn/conn');

// CORS Middleware to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true
}));

// Standard Middleware
app.use(cookieParser());
app.use(express.json()); // To parse JSON bodies

// --- API Routes ---
const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');
const DietRoutes = require('./Routes/diet'); // Import the new diet routes

app.use('/api/auth', GymRoutes);
app.use('/api/plans', MembershipRoutes);
app.use('/api/members', MemberRoutes);
app.use('/api/diet', DietRoutes); // Use the new diet routes

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
