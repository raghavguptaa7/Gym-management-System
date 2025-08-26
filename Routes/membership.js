const express = require("express");
const router = express.Router();
const MembershipController = require('../Controllers/membership');
// Corrected path to the authentication middleware
const { protect } = require('../Auth/auth');

// Apply the authentication middleware to all routes in this file
router.use(protect);

// Route to add a new membership plan
router.post('/add-membership', MembershipController.addMembership);

// Route to get all existing membership plans
router.get('/get-membership', MembershipController.getmembership);

module.exports = router;