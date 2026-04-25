const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, verifyPayment, createCodOrder } = require('../controllers/paymentController');


// Define API endpoints for payment
router.post('/cod', protect, createCodOrder);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
