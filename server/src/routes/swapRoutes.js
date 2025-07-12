const express = require('express');
const router = express.Router();
const {
  createSwap,
  getUserSwaps,
  getSwap,
  acceptSwap,
  rejectSwap,
  completeSwap,
  cancelSwap,
  sendMessage,
  getSwapStats
} = require('../controllers/swapController');
const { protect } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// Create a new swap request
router.post('/', createSwap);

// Get user's swaps (with optional status filter)
router.get('/', getUserSwaps);

// Get swap statistics
router.get('/stats', getSwapStats);

// Get specific swap details
router.get('/:swapId', getSwap);

// Accept swap request
router.patch('/:swapId/accept', acceptSwap);

// Reject swap request
router.patch('/:swapId/reject', rejectSwap);

// Complete swap
router.patch('/:swapId/complete', completeSwap);

// Cancel swap
router.patch('/:swapId/cancel', cancelSwap);

// Send message in swap
router.post('/:swapId/messages', sendMessage);

module.exports = router; 