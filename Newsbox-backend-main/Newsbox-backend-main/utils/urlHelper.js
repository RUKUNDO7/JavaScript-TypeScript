const path = require('path');

/**
 * Generate complete URL for uploaded files
 * @param {string} filePath - The relative file path
 * @param {Object} req - Express request object
 * @returns {string} Complete URL for the file
 */
const generateFileUrl = (filePath, req) => {
  if (!filePath) return null;

  // If already an absolute URL (Cloudinary, etc.), return as-is
  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  // Use environment variable for base URL or construct from request
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

  // Ensure filePath starts with /uploads
  const normalizedPath = filePath.startsWith('/uploads') 
    ? filePath 
    : `/uploads/${filePath}`;

  return `${baseUrl}${normalizedPath}`;
};

/**
 * Convert a profile object to include complete URLs
 * @param {Object} profile - Profile object from database
 * @param {Object} req - Express request object
 * @returns {Object} Profile object with complete URLs
 */
const addProfileUrls = (profile, req) => {
  if (!profile) return profile;
  
  const profileObj = profile.toObject ? profile.toObject() : profile;
  
  if (profileObj.profilePic) {
    profileObj.profilePicUrl = generateFileUrl(profileObj.profilePic, req);
  }
  
  return profileObj;
};

module.exports = {
  generateFileUrl,
  addProfileUrls
};
