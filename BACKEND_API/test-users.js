const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Subscription = require('./models/Subscription');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const users = await User.find({}).select('-password');
      console.log("USERS:", JSON.stringify(users, null, 2));

      const subscriptions = await Subscription.find({})
        .populate('user', 'name email avatar')
        .populate('product', 'name price image');
      console.log("SUBSCRIPTIONS:", JSON.stringify(subscriptions, null, 2));
      
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
