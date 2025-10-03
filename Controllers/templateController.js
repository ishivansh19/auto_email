const User = require('../models/User');

// @desc    Get user's template
exports.getTemplate = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ body: user.template || '' });
};

// @desc    Save user's template
exports.saveTemplate = async (req, res) => {
    const { body } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { template: body }, { new: true });
    res.status(200).json({ body: user.template });
};