const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check headers for 'Authorization' token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Format: "Bearer <token>"
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        // Attach user to the request object
        req.user = await User.findById(decoded.id);

        next(); // Proceed to the next function (the controller)
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
};