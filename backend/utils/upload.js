const cloudinary = require('../config/cloudinary');

/**
 * Uploads a base64 image or file path to Cloudinary
 * @param {string} fileContent - The base64 string or local file path
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadToCloudinary = async (fileContent, folder = 'bareskin/products') => {
    try {
        if (!fileContent) return null;
        
        // If it's already a URL, don't re-upload
        if (fileContent.startsWith('http')) return fileContent;

        const result = await cloudinary.uploader.upload(fileContent, {
            folder: folder,
            resource_type: 'auto'
        });
        
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

module.exports = { uploadToCloudinary };
