# Image Setup Guide for ReWear

## Problem
Users can see their own uploaded images but not images uploaded by other users.

## Solution 1: Fix Local Storage (Quick Fix)

### What I've Done:
1. ✅ Added CORS headers for image serving
2. ✅ Created image utility functions to ensure consistent URLs
3. ✅ Updated item controller to process image URLs
4. ✅ Updated frontend to use full URLs directly

### To Apply the Fix:
1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm run dev
```

3. Test by uploading images and checking if they appear for all users.

## Solution 2: Use Cloudinary (Recommended for Production)

### Setup Cloudinary:
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rewear

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server
PORT=3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Switch to Cloudinary:
1. Install Cloudinary:
```bash
cd server
npm install cloudinary
```

2. Replace the item controller:
```bash
# Backup the current controller
mv src/controllers/itemController.js src/controllers/itemController.js.backup

# Use the Cloudinary version
mv src/controllers/itemControllerCloudinary.js src/controllers/itemController.js
```

3. Restart the server:
```bash
npm run dev
```

## Testing the Fix

### For Local Storage Fix:
1. Upload an item with images
2. Check if images appear in the landing page
3. Have a friend upload an item and check if you can see their images
4. Check browser console for any CORS errors

### For Cloudinary Fix:
1. Set up Cloudinary credentials
2. Upload an item with images
3. Check if images appear with Cloudinary URLs
4. Verify images work across different users

## Troubleshooting

### If images still don't show:
1. Check browser console for errors
2. Verify the uploads folder exists: `server/uploads/`
3. Check if the server is serving static files correctly
4. Verify CORS headers are set

### For Cloudinary issues:
1. Verify credentials in `.env` file
2. Check Cloudinary dashboard for uploads
3. Verify network connectivity

## Benefits of Each Solution

### Local Storage:
- ✅ No external dependencies
- ✅ Works offline
- ✅ No upload limits
- ❌ Requires server storage
- ❌ Not scalable for production

### Cloudinary:
- ✅ Scalable and reliable
- ✅ Automatic image optimization
- ✅ CDN for fast loading
- ✅ No server storage needed
- ❌ Requires internet connection
- ❌ Has usage limits (free tier available) 