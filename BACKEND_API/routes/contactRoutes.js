const express = require('express');
const router = express.Router();
const { submitContactMessage, getContactMessages, markMessageAsRead, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContactMessage)
  .get(protect, admin, getContactMessages);

router.route('/:id/read')
  .put(protect, admin, markMessageAsRead);

router.route('/:id')
  .delete(protect, admin, deleteMessage);

module.exports = router;
