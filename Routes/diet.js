const express = require('express');
const router = express.Router();
const dietController = require('../Controllers/dietController');
const { protect } = require('../Auth/auth');

// Apply the authentication middleware to protect this route
router.use(protect);

// Route to generate a diet plan
router.post('/generate', dietController.generateDietPlan);

module.exports = router;