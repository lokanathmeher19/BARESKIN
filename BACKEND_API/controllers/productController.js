const Product = require('../models/Product');
const { uploadToCloudinary } = require('../utils/upload');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, subCategory, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, brand, price, category, subCategory, description, stock, image, images, skinType, ingredients, usage, phLevel, sizes, discountPercentage, rating, numReviews } = req.body;

    if (!name || !price || !category || !description || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // UPLOAD TO CLOUDINARY (MAIN IMAGE)
    let imageUrl = image;
    if (image && !image.startsWith('http')) {
        imageUrl = await uploadToCloudinary(image);
    }

    // UPLOAD TO CLOUDINARY (GALLERY IMAGES)
    let galleryUrls = [];
    if (images && Array.isArray(images)) {
        galleryUrls = await Promise.all(
            images.map(img => uploadToCloudinary(img))
        );
    }

    const product = await Product.create({
      name,
      brand,
      price,
      category,
      subCategory,
      description,
      stock,
      image: imageUrl,
      images: galleryUrls,
      skinType,
      ingredients,
      usage,
      phLevel,
      sizes,
      discountPercentage,
      rating,
      numReviews
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // UPLOAD TO CLOUDINARY IF NEW MAIN IMAGE IS PROVIDED
    if (updateData.image && !updateData.image.startsWith('http')) {
        updateData.image = await uploadToCloudinary(updateData.image);
    }

    // UPLOAD TO CLOUDINARY IF NEW GALLERY IMAGES ARE PROVIDED
    if (updateData.images && Array.isArray(updateData.images)) {
        updateData.images = await Promise.all(
            updateData.images.map(img => uploadToCloudinary(img))
        );
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, beforeImage, afterImage } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'Product already reviewed' });
      }

      let beforeUrl = '';
      let afterUrl = '';

      if (beforeImage && !beforeImage.startsWith('http')) {
          beforeUrl = await uploadToCloudinary(beforeImage);
      } else if (beforeImage) {
          beforeUrl = beforeImage;
      }

      if (afterImage && !afterImage.startsWith('http')) {
          afterUrl = await uploadToCloudinary(afterImage);
      } else if (afterImage) {
          afterUrl = afterImage;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        beforeImage: beforeUrl,
        afterImage: afterUrl
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      // CREDIT POINTS FOR REVIEW
      const User = require('../models/User');
      const userObj = await User.findById(req.user._id);
      if (userObj) {
          userObj.points = (userObj.points || 0) + 50;
          await userObj.save();
      }

      res.status(201).json({ success: true, message: 'Review added' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
