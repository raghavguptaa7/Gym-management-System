const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Member name is required.'],
        trim: true
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile number is required.'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true
    },
    plan: {
        type: String, // Stores the name of the plan, e.g., "Gold Monthly"
        required: [true, 'Plan is required.']
    },
    profilePic: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.gj6t3grz5no6UZ03uIluiwHaHa?rs=1&pid=ImgDetMain'
    },
    joiningDate: {
        type: Date,
        required: true
    },
    nextBillDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true
    }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;