const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const adminEmail = process.env.ADMIN_EMAIL || 'meherlokanath314@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Biswa12345';

const products = [
  // Skin Care
  {
    name: 'Vitamin B12 + NMF complex Toner',
    brand: 'BareSkin',
    price: 1299,
    category: 'Skin Care',
    description: 'A revolutionary hydrating toner that restores your skin barrier using natural moisturizing factors and Vitamin B12. Perfect for daily hydration and texture refinement.',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=400&q=80',
    stock: 50,
    skinType: ['Dry', 'Sensitive', 'Normal'],
    ingredients: 'Aqua, Glycerin, Cyanocobalamin (Vitamin B12), Sodium PCA, Urea, Trehalose, Sodium Hyaluronate.',
    usage: 'Apply to clean skin after cleansing. Gently pat until absorbed. Use daily AM/PM.',
    phLevel: '5.5 - 6.0'
  },
  {
    name: 'Salicylic Acid 02% Cleanser',
    brand: 'BareSkin',
    price: 899,
    category: 'Skin Care',
    description: 'Targeted pore-cleansing formula that removes excess oil and targets blackheads without stripping the skin of moisture.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80',
    stock: 75,
    skinType: ['Oily', 'Acne-Prone', 'Combination'],
    ingredients: 'Salicylic Acid (2.0%), Cocamidopropyl Betaine, Glycerin, Niacinamide, Zinc PCA.',
    usage: 'Massage a small amount onto damp skin for 60 seconds. Rinse with lukewarm water.',
    phLevel: '4.5 - 5.0'
  },
  // Lip Care
  {
    name: 'Ceramide Lip Repair Balm',
    brand: 'BareSkin',
    price: 499,
    category: 'Lip Care',
    description: 'Intensive overnight treatment for dry, cracked lips. Forms a protective barrier using botanical waxes and ceramides.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80',
    stock: 120
  },
  // Hair Care
  {
    name: 'Revitalizing Scalp Serum',
    brand: 'BareSkin',
    price: 1599,
    category: 'Hair Care',
    description: 'A lightweight serum designed to rebalance the scalp microbiome and promote healthier, stronger hair growth from the roots.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    stock: 40
  },
  // Makeup
  {
    name: 'Glow Tech Foundation',
    brand: 'BareSkin',
    price: 2499,
    category: 'Makeup',
    description: 'Ultra-thin, breathable foundation with SPF 30. Provides a natural, seconds-skin finish with buildable coverage.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    stock: 30
  },
  {
    name: 'Mineral Tinted Moisturizer',
    brand: 'BareSkin',
    price: 1899,
    category: 'Makeup',
    description: 'The perfect hybrid of skincare and makeup. Evens out skin tone while providing deep hydration and sun protection.',
    image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?auto=format&fit=crop&w=400&q=80',
    stock: 60
  },
  // Body Care
  {
    name: 'Niacinamide Body Lotion',
    brand: 'BareSkin',
    price: 999,
    category: 'Body Care',
    description: 'Fast-absorbing formula that brightens skin tone and improves skin elasticity over time. Non-greasy and deeply nourishing.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    stock: 85
  },
  // Beauty
  {
    name: 'Rose Quartz Facial Roller',
    brand: 'BareSkin',
    price: 1199,
    category: 'Beauty',
    description: 'Hand-crafted rose quartz roller to promote lymphatic drainage and enhance the absorption of your favorite serums.',
    image: 'https://images.unsplash.com/photo-1615396184163-5973c9db86c4?auto=format&fit=crop&w=400&q=80',
    stock: 25
  },
  // Men's Care
  {
    name: 'Activated Charcoal Face Wash',
    brand: 'BareSkin Men',
    price: 699,
    category: "Men's Care",
    description: 'Deep-cleansing charcoal formula specifically designed for thicker male skin. Removes daily grime and pollution while preventing ingrown hairs.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80',
    stock: 100
  },
  {
    name: 'Sandalwood Beard Oil',
    brand: 'BareSkin Men',
    price: 899,
    category: "Men's Care",
    description: 'A premium blend of argan and jojoba oils infused with natural sandalwood. Softens coarse hair and hydrates the skin beneath.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80',
    stock: 45
  }
];

const importData = async () => {
  try {
    // Products
    await Product.deleteMany();
    
    const productsWithRatings = products.map(product => ({
      ...product,
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      numReviews: Math.floor(Math.random() * 190) + 10,
      discountPercentage: [0, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)]
    }));

    await Product.insertMany(productsWithRatings);
    console.log('Products Imported with Ratings!');

    // Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Delete all users to ensure fresh start
    await User.deleteMany();
    
    await User.create({
      name: 'Lokanath Meher',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Admin User Created (Primary)!');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
