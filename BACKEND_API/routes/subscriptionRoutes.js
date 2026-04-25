const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getMySubscriptions, cancelSubscription, skipSubscription } = require('../controllers/subscriptionController');
const { getAllSubscriptions, updateSubscriptionStatus } = require('../controllers/adminSubscriptionController');

// User Routes
router.get('/my', protect, getMySubscriptions);
router.put('/:id/cancel', protect, cancelSubscription);
router.put('/:id/skip', protect, skipSubscription);

// Admin Routes
router.get('/admin', protect, admin, getAllSubscriptions);
router.put('/:id/status', protect, admin, updateSubscriptionStatus);

module.exports = router;
