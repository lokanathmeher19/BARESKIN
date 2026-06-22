const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        zip: user.zip || '',
        city: user.city || '',
        state: user.state || '',
        address: user.address || '',
        points: user.points,
        isAdmin: user.isAdmin,
        skinType: user.skinType,
        skinConcerns: user.skinConcerns,
        usageProtocols: user.usageProtocols,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please add email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email }).populate('cart.product wishlist');

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been blocked by an administrator.' });
      }
      res.json({
        success: true,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        zip: user.zip || '',
        city: user.city || '',
        state: user.state || '',
        address: user.address || '',
        points: user.points,
        isAdmin: user.isAdmin,
        cart: user.cart ? user.cart.filter(c => c.product).map(c => ({ ...c.product.toObject(), qty: c.qty, selectedSize: c.selectedSize })) : [],
        wishlist: user.wishlist || [],
        skinType: user.skinType,
        skinConcerns: user.skinConcerns,
        usageProtocols: user.usageProtocols,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate or Register with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email }).populate('cart.product wishlist');

    if (!user) {
      // Register user with Google
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(sub + process.env.JWT_SECRET, salt); // random password

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked by an administrator.' });
    }

    res.json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      zip: user.zip || '',
      city: user.city || '',
      state: user.state || '',
      address: user.address || '',
      points: user.points,
      isAdmin: user.isAdmin,
      cart: user.cart ? user.cart.filter(c => c.product).map(c => ({ ...c.product.toObject(), qty: c.qty, selectedSize: c.selectedSize })) : [],
      wishlist: user.wishlist || [],
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

// @desc    Update user profile
// @route   POST /api/auth/profile-update
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const updateData = {};
    const fields = ['name', 'phone', 'zip', 'city', 'state', 'address', 'notificationSettings', 'skinType', 'skinConcerns', 'usageProtocols'];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (updatedUser) {
      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          zip: updatedUser.zip,
          city: updatedUser.city,
          state: updatedUser.state,
          address: updatedUser.address,
          points: updatedUser.points,
          notificationSettings: updatedUser.notificationSettings,
          isAdmin: updatedUser.isAdmin,
          skinType: updatedUser.skinType,
          skinConcerns: updatedUser.skinConcerns,
          usageProtocols: updatedUser.usageProtocols,
        },
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   POST /api/auth/password-update
// @access  Private
const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      
      // Send Security Alert Email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Security Alert - Password Changed',
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
              <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
              <h2>Security Notice</h2>
              <p>Hello ${user.name},</p>
              <p>Your BareSkin account password was recently changed.</p>
              <p>If you made this change, you can safely ignore this email.</p>
              <p style="color: red;"><strong>If you did not make this change, please contact our support team immediately.</strong></p>
              <br/>
              <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send password update email:', emailError);
      }

      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Sync user cart
// @route   POST /api/auth/sync-cart
// @access  Private
const syncCart = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const cartData = cart.map(item => ({
      product: item._id || item.id,
      qty: item.qty,
      selectedSize: item.selectedSize
    }));
    await User.findByIdAndUpdate(req.user._id, { 
      $set: { 
        cart: cartData,
        cartUpdatedAt: Date.now() 
      },
      $unset: { abandonedCartEmailedAt: 1 } 
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync user wishlist
// @route   POST /api/auth/sync-wishlist
// @access  Private
const syncWishlist = async (req, res, next) => {
  try {
    const { wishlist } = req.body;
    const wishlistData = wishlist.map(item => item._id || item.id);
    await User.findByIdAndUpdate(req.user._id, { $set: { wishlist: wishlistData } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    // Use the frontendUrl passed from the client if available, so it works perfectly across devices (e.g. mobile phones accessing the local IP)
    const baseUrl = req.body.frontendUrl || `${req.protocol}://${req.hostname}:5173`;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h1 style="color: #000; font-style: italic; text-transform: uppercase;">BARESKIN.</h1>
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click the link below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">Reset Password</a>
        <br/><br/>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p style="color: #888; font-size: 12px;">BareSkin Premium Essentials</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        html: message,
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const crypto = require('crypto');
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  updateUserProfile,
  updateUserPassword,
  syncCart,
  syncWishlist,
  forgotPassword,
  resetPassword
};
