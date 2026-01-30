const sharp = require('sharp'); // npm install sharp
const fs = require('fs');
const path = require('path');

/**
 * Compress and resize uploaded images
 */
const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(300, 300, { // Resize to 300x300 max
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 80,  // Compress to 80% quality
        progressive: true 
      })
      .toFile(outputPath);
    
    // Delete original large file
    fs.unlinkSync(inputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image optimization failed:', error);
    return inputPath; // Return original if optimization fails
  }
};

/**
 * Clean up old profile pictures when user updates
 */
const deleteOldProfilePic = (oldPicPath) => {
  if (!oldPicPath || oldPicPath.includes('defaultProfile.png')) return;
  
  const fullPath = path.join(__dirname, '..', 'uploads', oldPicPath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log('Deleted old profile pic:', oldPicPath);
  }
};

/**
 * Clean up orphaned images (run as cron job)
 */
const cleanupOrphanedImages = async () => {
  // This would compare files in uploads/images with database records
  // and delete files not referenced in the database
};

module.exports = {
  optimizeImage,
  deleteOldProfilePic,
  cleanupOrphanedImages
};
