const jwt = require('jsonwebtoken');
const Gym = require('../Modals/gym');

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SecretKey);

            // Find the user by the ID from the token and attach it to the request
            // Exclude the password field from the result
            req.gym = await Gym.findById(decoded.id).select('-password');

            if (!req.gym) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};