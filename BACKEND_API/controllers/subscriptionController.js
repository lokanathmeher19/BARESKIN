const Subscription = require('../models/Subscription');

// @desc    Get user subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
const getMySubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id })
            .populate('product', 'name image price')
            .sort('-createdAt');
            
        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        // Check ownership
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        subscription.status = 'Cancelled';
        await subscription.save();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Skip next billing period
// @route   PUT /api/subscriptions/:id/skip
// @access  Private
const skipSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        // Check ownership
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const currentDate = new Date(subscription.nextBillingDate);
        currentDate.setDate(currentDate.getDate() + 30);
        subscription.nextBillingDate = currentDate;
        
        await subscription.save();

        res.status(200).json({
            success: true,
            message: 'Subscription skipped successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMySubscriptions,
    cancelSubscription,
    skipSubscription
};
