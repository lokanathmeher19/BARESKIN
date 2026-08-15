const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  beforeImage: {
    type: String,
    default: '',
  },
  afterImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
  },
  brand: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
  },
  image: {
    type: String,
    required: false,
    default: 'https://via.placeholder.com/600x600?text=BareSkin+Product',
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Please add the product stock level'],
    default: 0,
  },
  skinType: {
    type: [String],
    default: ['All Skin Types'],
  },
  ingredients: {
    type: String,
    required: false,
  },
  usage: {
    type: String,
    required: false,
  },
  phLevel: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
    default: 0
  },
  numReviews: {
    type: Number,
    required: false,
    default: 0
  },
  reviews: [reviewSchema],
  discountPercentage: {
    type: Number,
    required: false,
    default: 0
  },
  sizes: {
    type: [String],
    default: []
  },
  variants: [{
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }
  }],
  promoTag: {
    type: String,
    required: false,
    default: ''
  },
  badgeText: {
    type: String,
    required: false,
    default: ''
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
