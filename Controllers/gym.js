const Gym = require('../Modals/gym');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SecretKey, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

// 1. User Registration (Signup)
exports.register = async (req, res) => {
    try {
        const { userName, password, gymName, profilePic, email } = req.body;

        if (!userName || !password || !gymName || !email) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const isExist = await Gym.findOne({ userName });
        if (isExist) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newGym = new Gym({
            userName,
            password: hashedPassword,
            gymName,
            profilePic,
            email
        });

        await newGym.save();

        res.status(201).json({
            message: "Registration successful!",
            gym: { id: newGym._id, userName: newGym.userName, gymName: newGym.gymName }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

// 2. User Login
exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: "Please provide username and password." });
        }

        const gym = await Gym.findOne({ userName });

        if (gym && await bcrypt.compare(password, gym.password)) {
            const token = generateToken(gym._id);
            res.status(200).json({
                message: "Login successful",
                token,
                gymName: gym.gymName,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD // Use an App Password for Gmail
    }
});

// 3. Send Password Reset OTP
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const gym = await Gym.findOne({ email });

        if (gym) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
            gym.resetPasswordToken = otp;
            gym.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

            await gym.save();

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Your Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}. It is valid for 1 hour.`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'OTP sent to your email.' });

        } else {
            return res.status(404).json({ message: 'User with this email not found.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server Error"
        });
    }
};

// 4. Verify OTP
exports.checkOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!gym) {
            return res.status(400).json({ message: 'OTP is invalid or has expired.' });
        }

        res.status(200).json({ message: "OTP is Successfully Verified" });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server Error"
        });
    }
};

// 5. Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!gym) {
            return res.status(400).json({ message: 'OTP is invalid or has expired. Please try again.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        gym.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        gym.resetPasswordToken = undefined;
        gym.resetPasswordExpires = undefined;
        
        await gym.save();

        res.status(200).json({ message: "Password Reset Successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server Error"
        });
    }
};

// 6. Logout
exports.logout = async (req, res) => {
    // This is typically handled on the client-side by clearing the token
    res.status(200).json({ message: 'Logged out successfully' });
};
