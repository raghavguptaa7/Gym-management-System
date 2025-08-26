const express = require("express");
const router = express.Router();
const GymController = require('../Controllers/gym');

// Public routes for user authentication
// CORRECTED: Changed '/register' to '/signup' to match the frontend call
router.post('/signup', GymController.register); 
router.post('/login', GymController.login);

// Password Reset Routes
router.post('/reset-password/sendOtp', GymController.sendOtp);
router.post('/reset-password/checkOtp', GymController.checkOtp);
router.post('/reset-password', GymController.resetPassword);

// Logout route
router.post('/logout', GymController.logout);

module.exports = router;