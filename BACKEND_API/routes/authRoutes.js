const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, updateUserProfile, updateUserPassword, syncCart, syncWishlist, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/profile-update', protect, updateUserProfile);
router.post('/password-update', protect, updateUserPassword);
router.post('/sync-cart', protect, syncCart);
router.post('/sync-wishlist', protect, syncWishlist);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
