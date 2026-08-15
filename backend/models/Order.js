const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  guestEmail: {
    type: String,
    required: false,
  },
  guestName: {
    type: String,
    required: false,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      selectedSize: {
        type: String,
        required: false,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'Pending', // Pending, Paid, Expired
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Order Placed',
    enum: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
  },
  razorpayOrderId: {
    type: String,
    required: false
  },
  expiresAt: {
    type: Date,
    required: false
  },
  pointsUsed: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
