const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  zip: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      qty: {
        type: Number,
        default: 1,
      },
      selectedSize: {
        type: String,
        required: false,
      },
    }
  ],
  cartUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  abandonedCartEmailedAt: {
    type: Date,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }
  ],
  notificationSettings: {
    orderUpdates: { type: Boolean, default: true },
    researchAlerts: { type: Boolean, default: true },
    loyaltyMilestones: { type: Boolean, default: false },
    directMessages: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
