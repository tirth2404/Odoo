const express = require('express');
const router = express.Router();
const {
  getPendingItems,
  approveItem,
  rejectItem,
  markAsFeatured,
  removeFeatured,
  getDashboardStats,
  getAllUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Item management
router.get('/items/pending', getPendingItems);
router.post('/items/:id/approve', approveItem);
router.post('/items/:id/reject', rejectItem);
router.post('/items/:id/feature', markAsFeatured);
router.post('/items/:id/unfeature', removeFeatured);

// Dashboard and users
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);

module.exports = router; 