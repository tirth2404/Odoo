const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getFeaturedItems,
  getCategories,
  getItem,
  updateItem,
  deleteItem,
  toggleLike,
  getMyItems
} = require('../controllers/itemController');
const { protect } = require('../middlewares/auth');

// Multer setup for local uploads
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Public routes
router.get('/', getItems);
router.get('/featured', getFeaturedItems);
router.get('/categories', getCategories);
router.get('/:id', getItem);

// Protected routes
router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/:id/like', protect, toggleLike);
router.get('/my-items', protect, getMyItems);

module.exports = router; 