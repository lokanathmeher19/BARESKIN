const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const updateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Add sizes to existing products
    await Product.updateMany(
        { category: 'Skin Care' },
        { sizes: ['50 ML', '100 ML', '250 ML'] }
    );
    
    await Product.updateMany(
        { category: 'Beauty' },
        { sizes: ['S', 'M', 'L'] }
    );
    
    // Create a Shoe product just to demonstrate the design
    const shoeExists = await Product.findOne({ name: 'Luxe Track Shoes 01' });
    if (!shoeExists) {
        await Product.create({
            name: 'Luxe Track Shoes 01',
            brand: 'BareSkin Active',
            price: 4999,
            category: 'Footwear',
            description: 'Ergonomic performance running shoes with breathable mesh and carbon fiber support. Premium design for elite athletes.',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            stock: 25,
            sizes: ['6', '7', '8', '9', '10', '11'],
            rating: 4.9,
            numReviews: 85
        });
        console.log('Shoe product created.');
    }
    
    console.log('Products updated with sizes.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateProducts();
