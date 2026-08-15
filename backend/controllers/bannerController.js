const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all banners for admin
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
    const { text } = req.body;
    try {
        const bannerCount = await Banner.countDocuments();
        if (bannerCount >= 5) {
            return res.status(400).json({ message: 'Maximum 5 banners allowed' });
        }
        const banner = new Banner({ text });
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            banner.text = req.body.text || banner.text;
            banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBanners,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
};
