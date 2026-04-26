const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, createCodOrder } = require('../controllers/paymentController');

const optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const jwt = require('jsonwebtoken');
            const User = require('../models/User');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error('Optional Protect Error:', error);
        }
    }
    next();
};

// Define API endpoints for payment
router.post('/cod', optionalProtect, createCodOrder);
router.post('/create-order', optionalProtect, createOrder);
router.post('/verify', optionalProtect, verifyPayment);

module.exports = router;
