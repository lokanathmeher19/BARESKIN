const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const MONGO_URI = 'mongodb+srv://meherlokanath314_db_user:bareskinAdmin@cluster0.1n1kx0h.mongodb.net/bareskin?appName=Cluster0';
const JWT_SECRET = 'supersecretjwtkey123';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({}));
        const Product = mongoose.model('Product', new mongoose.Schema({
            price: Number
        }));

        const user = await User.findOne({});
        const product = await Product.findOne({});

        if (!user || !product) {
            console.error('User or Product not found in DB');
            process.exit(1);
        }

        console.log(`Found User: \${user._id}`);
        console.log(`Found Product: \${product._id}`);

        // Sign JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        // Test Payload
        const payload = {
            amount: product.price,
            products: [
                {
                    _id: product._id,
                    qty: 1
                }
            ],
            userId: user._id,
            address: '123 Test Street, Odisha - 768040',
            pointsToRedeem: 0
        };

        console.log('Sending payload:', payload);

        const response = await axios.post('http://localhost:5000/api/payment/cod', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

    } catch (error) {
        console.error('Error in test:');
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    } finally {
        mongoose.disconnect();
    }
}

run();
