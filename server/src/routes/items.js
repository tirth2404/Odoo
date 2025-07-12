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

// Public routes
router.get('/', getItems);
router.get('/featured', getFeaturedItems);
router.get('/categories', getCategories);
router.get('/:id', getItem);

// Protected routes
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/:id/like', protect, toggleLike);
router.get('/my-items', protect, getMyItems);

module.exports = router; 