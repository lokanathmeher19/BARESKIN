const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Cancelled', 'Paused'],
    default: 'Active',
  },
  frequency: {
    type: String,
    required: true,
    default: 'Monthly',
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
  priceAtSubscription: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
