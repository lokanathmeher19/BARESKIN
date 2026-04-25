const PromoCode = require('../models/PromoCode');

// @desc    Get all promo codes
// @route   GET /api/promos
// @access  Private/Admin
const getPromoCodes = async (req, res, next) => {
  try {
    const promos = await PromoCode.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: promos });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a promo code
// @route   POST /api/promos
// @access  Private/Admin
const createPromoCode = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;

    const promoExists = await PromoCode.findOne({ code: code.toUpperCase() });
    if (promoExists) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    const promo = await PromoCode.create({
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit
    });

    res.status(201).json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a promo code
// @route   DELETE /api/promos/:id
// @access  Private/Admin
const deletePromoCode = async (req, res, next) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    await promo.deleteOne();
    res.status(200).json({ success: true, message: 'Promo code deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a promo code
// @route   POST /api/promos/validate
// @access  Public
const validatePromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a promo code' });
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Invalid promo code' });
    }

    if (!promo.isActive) {
      return res.status(400).json({ success: false, message: 'Promo code is no longer active' });
    }

    if (new Date() > new Date(promo.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' });
    }

    if (promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment promo usage
// @route   POST /api/promos/use
// @access  Private
const usePromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Please provide a promo code' });

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (promo) {
      promo.usedCount += 1;
      await promo.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPromoCodes,
  createPromoCode,
  deletePromoCode,
  validatePromoCode,
  usePromoCode
};
