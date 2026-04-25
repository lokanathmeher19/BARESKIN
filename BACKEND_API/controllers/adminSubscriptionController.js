const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions for admin
// @route   GET /api/subscriptions/admin
// @access  Private/Admin
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({})
            .populate('user', 'name email avatar')
            .populate('product', 'name price image')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update subscription status
// @route   PUT /api/subscriptions/:id/status
// @access  Private/Admin
const updateSubscriptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        subscription.status = status;
        await subscription.save();

        res.json({ success: true, data: subscription });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllSubscriptions,
    updateSubscriptionStatus
};
