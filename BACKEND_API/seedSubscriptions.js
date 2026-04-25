const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');
const connectDB = require('./config/db');

dotenv.config();
const start = async () => {
    await connectDB();
    await seedSubscriptions();
};

const seedSubscriptions = async () => {
    try {
        console.log('Starting subscription seeding...');
        
        // Clear existing subscriptions and orders (linked to subs)
        await Subscription.deleteMany();
        console.log('Cleared existing subscriptions.');
        
        // Get some users and products
        const admin = await User.findOne({ isAdmin: true });
        const products = await Product.find({}).limit(5);

        if (products.length === 0) {
            console.log('No products found. Please run seeder.js first.');
            process.exit(1);
        }

        // Create some diverse, realistic users
        const dummyUserData = [
            { name: 'Sarah Miller', email: 'sarah@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
            { name: 'James Wilson', email: 'james@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
            { name: 'Emily Davis', email: 'emily@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
            { name: 'Michael Chen', email: 'michael@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
            { name: 'Ananya Sharma', email: 'ananya@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
            { name: 'Arjun Mehra', email: 'arjun@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
            { name: 'Priya Iyer', email: 'priya@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
            { name: 'Rohan Gupta', email: 'rohan@example.com', password: 'password123', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
        ];

        const subscriberUsers = [];
        const salt = await bcrypt.genSalt(10);

        for (const u of dummyUserData) {
            let user = await User.findOne({ email: u.email });
            if (user) {
                // Update avatar if user exists
                user.avatar = u.avatar;
                await user.save();
            } else {
                const hashedPassword = await bcrypt.hash(u.password, salt);
                user = await User.create({ ...u, password: hashedPassword });
                console.log(`Created user: ${u.name}`);
            }
            subscriberUsers.push(user);
        }

        const subscriptions = [];

        for (let i = 0; i < 24; i++) {
            const user = subscriberUsers[i % subscriberUsers.length];
            const product = products[i % products.length];
            
            // Create a dummy order for this subscription
            const order = await Order.create({
                user: user._id,
                products: [{ product: product._id, quantity: 1 }],
                totalPrice: product.price * 0.9,
                paymentStatus: 'Paid',
                address: '123 Test St, Silicon Valley, CA'
            });

            const statusOptions = ['Active', 'Active', 'Active', 'Active', 'Active', 'Paused', 'Cancelled'];
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

            const nextBilling = new Date();
            nextBilling.setDate(nextBilling.getDate() + Math.floor(Math.random() * 25) + 5);

            subscriptions.push({
                user: user._id,
                product: product._id,
                order: order._id,
                status: status,
                frequency: 'Monthly',
                nextBillingDate: nextBilling,
                priceAtSubscription: product.price * 0.9
            });
        }

        await Subscription.insertMany(subscriptions);
        console.log(`Successfully seeded ${subscriptions.length} subscriptions!`);
        console.log('Real data is now available in the Admin Panel.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

start();
