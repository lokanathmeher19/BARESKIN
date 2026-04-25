const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const users = await User.find({});
    console.log('--- ALL USERS ---');
    users.forEach(user => {
        console.log(`Name: ${user.name}, Email: ${user.email}, isAdmin: ${user.isAdmin}, ID: ${user._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listUsers();
