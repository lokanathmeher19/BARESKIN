const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: "meherlokanath314@gmail.com" });
        if (user) {
            console.log("User Found:", user.name);
            console.log("Is Admin:", user.isAdmin);
        } else {
            console.log("User not found!");
        }
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

checkAdmin();
