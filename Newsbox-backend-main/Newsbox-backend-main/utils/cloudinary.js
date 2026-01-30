const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Cloudinary secure URL
 */
const uploadToCloudinary = async (filePath, folder = 'hnb-profiles') => {
  try {
    console.log('Uploading to Cloudinary:', filePath);
    
    // Generate fresh timestamp to avoid stale request errors
    const timestamp = Math.floor(Date.now() / 1000);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      timestamp: timestamp,
      // Optimize image automatically
      transformation: [
        { 
          width: 400, 
          height: 400, 
          crop: 'fill', 
          gravity: 'center',
          quality: 'auto:good',
          format: 'auto'
        }
      ]
    });
    
    // Delete local file after successful upload
    try {
      fs.unlinkSync(filePath);
      console.log('Local file deleted:', filePath);
    } catch (deleteError) {
      console.warn('Could not delete local file:', deleteError.message);
    }
    
    console.log('Cloudinary upload successful:', result.secure_url);
    return result.secure_url;
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Full Cloudinary URL
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      console.log('Not a Cloudinary URL, skipping deletion');
      return;
    }
    
    // Extract public ID from URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;
    
    await cloudinary.uploader.destroy(fullPublicId);
    console.log('Deleted from Cloudinary:', fullPublicId);
    
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error - deletion failure shouldn't break the app
  }
};

/**
 * Check if Cloudinary is properly configured
 * @returns {boolean}
 */
const isCloudinaryConfigured = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  return required.every(key => process.env[key]);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured
};
