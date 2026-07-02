const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Update the only user to have a proper name and be the only admin
    const result = await User.findOneAndUpdate(
        { email: 'meherlokanath314@gmail.com' },
        { name: 'Lokanath Meher', isAdmin: true },
        { new: true }
    );
    
    if (result) {
        console.log(`Updated Admin: ${result.name} (${result.email})`);
    } else {
        console.log('Admin user not found with that email.');
    }
    
    // Demote any other admins if they exist
    const demoteResult = await User.updateMany(
        { email: { $ne: 'meherlokanath314@gmail.com' }, isAdmin: true },
        { isAdmin: false }
    );
    console.log(`Demoted ${demoteResult.modifiedCount} other users from admin status.`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixAdmin();
