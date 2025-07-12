const path = require('path');

// Get the base URL for images
const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL || 'http://localhost:3000'
    : 'http://localhost:3000';
};

// Convert relative image path to full URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, make it absolute
  if (imagePath.startsWith('/')) {
    return `${getBaseUrl()}${imagePath}`;
  }
  
  // If it's just a filename, add the uploads path
  return `${getBaseUrl()}/uploads/${imagePath}`;
};

// Process images array to ensure all URLs are absolute
const processImages = (images) => {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(image => ({
    ...image,
    url: getImageUrl(image.url)
  }));
};

module.exports = {
  getImageUrl,
  processImages,
  getBaseUrl
}; 