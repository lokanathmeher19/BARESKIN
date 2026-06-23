const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return res.status(200).json({ success: true, message: 'Re-subscribed successfully!' });
      }
      return res.status(400).json({ success: false, message: 'Email is already subscribed' });
    }

    const newSubscriber = await NewsletterSubscriber.create({ email });

    res.status(201).json({ success: true, message: 'Subscribed successfully!', data: newSubscriber });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribeNewsletter,
};
