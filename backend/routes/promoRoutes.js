const express = require('express');
const router = express.Router();
const {
  getPromoCodes,
  createPromoCode,
  deletePromoCode,
  validatePromoCode,
  usePromoCode
} = require('../controllers/promoController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getPromoCodes)
  .post(protect, admin, createPromoCode);

router.route('/validate')
  .post(validatePromoCode);

router.route('/use')
  .post(protect, usePromoCode);

router.route('/:id')
  .delete(protect, admin, deletePromoCode);

module.exports = router;
