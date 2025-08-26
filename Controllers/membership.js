const Membership = require('../Modals/membership');

// 1. Add a new Membership Plan
exports.addMembership = async (req, res) => {
    try {
        // Now expecting planName, duration, and price to match the frontend
        const { planName, duration, price } = req.body; 
        
        if (!planName || !duration || !price) {
            return res.status(400).json({ message: "Please provide plan name, duration (in days), and price." });
        }

        const existingPlan = await Membership.findOne({ gym: req.gym._id, planName });
        if (existingPlan) {
            return res.status(409).json({ message: 'A plan with this name already exists.' });
        }

        const newMembership = new Membership({
            planName,
            duration,
            price,
            gym: req.gym._id
        });

        await newMembership.save();
        res.status(201).json({ message: "Membership plan added successfully", plan: newMembership });

    } catch (err) {
        // This will now catch validation errors from the new schema
        console.log(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({
            error: "Server Error"
        });
    }
};

// 2. Get all Membership Plans for the gym
exports.getmembership = async (req, res) => {
    try {
        const plans = await Membership.find({ gym: req.gym._id }).sort({ price: 1 }); // Sort by price
        res.status(200).json(plans);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Server Error"
        });
    }
};