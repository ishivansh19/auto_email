const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Create and send token
        sendTokenResponse(user, 201, res);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user and get password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create and send token
        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to create, sign, and send the JWT
const sendTokenResponse = (user, statusCode, res) => {
    const payload = { id: user._id };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    
    res.status(statusCode).json({
        accesToken: token
    });
};

// @desc    Get current logged in user
exports.getMe = async (req, res) => {
    // req.user is attached by the 'protect' middleware
    // We use .select('-password') just in case it was included elsewhere
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};