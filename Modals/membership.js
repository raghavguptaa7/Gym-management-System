const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Plan name is required.'],
        trim: true
    },
    duration: {
        type: Number, // Duration in days
        required: [true, 'Duration in days is required.']
    },
    price: {
        type: Number,
        required: [true, 'Price is required.']
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    }
}, { timestamps: true });

const Membership = mongoose.model('membership', membershipSchema);

module.exports = Membership;