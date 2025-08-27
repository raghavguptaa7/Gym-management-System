const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDB = require('./DBConn/conn');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// CORS Middleware to allow requests from both local and production frontends
app.use(cors({
    origin: [
        'http://localhost:3000', // For your local development
        'http://localhost:3001', // In case your local port changes
        'https://gym-management-system-brown-six.vercel.app' // Your live Vercel URL
    ],
    credentials: true
}));

// Standard Middleware
app.use(cookieParser());
app.use(express.json()); // To parse JSON bodies

// --- API Routes ---
const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');
const DietRoutes = require('./Routes/diet');

app.use('/api/auth', GymRoutes);
app.use('/api/plans', MembershipRoutes);
app.use('/api/members', MemberRoutes);
app.use('/api/diet', DietRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});


