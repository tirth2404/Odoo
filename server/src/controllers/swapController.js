const mongoose = require('mongoose');
const Swap = require('../models/Swap');
const User = require('../models/User');
const Item = require('../models/Item');
const { errorResponse, successResponse } = require('../utils/errorResponse');

// Create a new swap request
exports.createSwap = async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, requesterNote, pointsExchange } = req.body;
    const requesterId = req.user.id;

    // Validate input
    if (!requestedItemId || !offeredItemId) {
      return errorResponse(res, 'Requested item and offered item are required', 400);
    }

    // Get the requested item and check if it's available
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem) {
      return errorResponse(res, 'Requested item not found', 404);
    }

    if (requestedItem.status !== 'available' || !requestedItem.isApproved) {
      return errorResponse(res, 'Requested item is not available for swap', 400);
    }

    // Get the offered item and check ownership
    const offeredItem = await Item.findById(offeredItemId);
    if (!offeredItem) {
      return errorResponse(res, 'Offered item not found', 404);
    }

    if (offeredItem.owner.toString() !== requesterId) {
      return errorResponse(res, 'You can only offer items you own', 403);
    }

    if (offeredItem.status !== 'available' || !offeredItem.isApproved) {
      return errorResponse(res, 'Offered item is not available for swap', 400);
    }

    // Check if items are already in a swap
    const existingSwap = await Swap.findOne({
      $or: [
        { requestedItem: requestedItemId, status: { $in: ['pending', 'accepted'] } },
        { offeredItem: offeredItemId, status: { $in: ['pending', 'accepted'] } },
        { requestedItem: offeredItemId, status: { $in: ['pending', 'accepted'] } },
        { offeredItem: requestedItemId, status: { $in: ['pending', 'accepted'] } }
      ]
    });

    if (existingSwap) {
      return errorResponse(res, 'One or both items are already in a swap', 400);
    }

    // Check if user has enough points
    const requester = await User.findById(requesterId);
    const totalPointsNeeded = (pointsExchange?.requesterPoints || 0);
    
    if (requester.points < totalPointsNeeded) {
      return errorResponse(res, 'Insufficient points for this swap', 400);
    }

    // Create the swap
    const swap = new Swap({
      requester: requesterId,
      recipient: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      requesterNote,
      pointsExchange: pointsExchange || { requesterPoints: 0, recipientPoints: 0 }
    });

    await swap.save();

    // Populate the swap for response
    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' }
    ]);

    successResponse(res, 'Swap request created successfully', swap, 201);
  } catch (error) {
    console.error('Create swap error:', error);
    errorResponse(res, 'Failed to create swap request', 500);
  }
};

// Get user's swaps
exports.getUserSwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const swaps = await Swap.getUserSwaps(userId, status);

    successResponse(res, 'Swaps retrieved successfully', swaps);
  } catch (error) {
    console.error('Get user swaps error:', error);
    errorResponse(res, 'Failed to retrieve swaps', 500);
  }
};

// Get specific swap details
exports.getSwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;

    const swap = await Swap.findById(swapId)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .populate('requestedItem', 'title description category pointsValue owner')
      .populate('offeredItem', 'title description category pointsValue owner')
      .populate('messages.sender', 'name');

    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (!swap.canUserParticipate(userId)) {
      return errorResponse(res, 'Access denied', 403);
    }

    successResponse(res, 'Swap retrieved successfully', swap);
  } catch (error) {
    console.error('Get swap error:', error);
    errorResponse(res, 'Failed to retrieve swap', 500);
  }
};

// Accept swap request
exports.acceptSwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;
    const { recipientNote } = req.body;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (swap.recipient.toString() !== userId) {
      return errorResponse(res, 'Only the recipient can accept the swap', 403);
    }

    if (swap.status !== 'pending') {
      return errorResponse(res, 'Swap is not in pending status', 400);
    }

    // Check if recipient has enough points
    const recipient = await User.findById(userId);
    const totalPointsNeeded = (swap.pointsExchange?.recipientPoints || 0);
    
    if (recipient.points < totalPointsNeeded) {
      return errorResponse(res, 'Insufficient points to accept this swap', 400);
    }

    // Update swap status
    swap.status = 'accepted';
    swap.recipientNote = recipientNote;
    await swap.save();

    // Mark items as in swap
    await Item.findByIdAndUpdate(swap.requestedItem, { status: 'pending' });
    await Item.findByIdAndUpdate(swap.offeredItem, { status: 'pending' });

    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' }
    ]);

    successResponse(res, 'Swap accepted successfully', swap);
  } catch (error) {
    console.error('Accept swap error:', error);
    errorResponse(res, 'Failed to accept swap', 500);
  }
};

// Reject swap request
exports.rejectSwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (swap.recipient.toString() !== userId) {
      return errorResponse(res, 'Only the recipient can reject the swap', 403);
    }

    if (swap.status !== 'pending') {
      return errorResponse(res, 'Swap is not in pending status', 400);
    }

    swap.status = 'rejected';
    swap.recipientNote = reason;
    await swap.save();

    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' }
    ]);

    successResponse(res, 'Swap rejected successfully', swap);
  } catch (error) {
    console.error('Reject swap error:', error);
    errorResponse(res, 'Failed to reject swap', 500);
  }
};

// Complete swap
exports.completeSwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (!swap.canUserParticipate(userId)) {
      return errorResponse(res, 'Access denied', 403);
    }

    if (!swap.canComplete()) {
      return errorResponse(res, 'Swap cannot be completed', 400);
    }

    // Update swap status
    swap.status = 'completed';
    swap.completedAt = new Date();
    await swap.save();

    // Transfer points
    if (swap.pointsExchange.requesterPoints > 0) {
      await User.findByIdAndUpdate(swap.requester, {
        $inc: { points: -swap.pointsExchange.requesterPoints }
      });
      await User.findByIdAndUpdate(swap.recipient, {
        $inc: { points: swap.pointsExchange.requesterPoints }
      });
    }

    if (swap.pointsExchange.recipientPoints > 0) {
      await User.findByIdAndUpdate(swap.recipient, {
        $inc: { points: -swap.pointsExchange.recipientPoints }
      });
      await User.findByIdAndUpdate(swap.requester, {
        $inc: { points: swap.pointsExchange.recipientPoints }
      });
    }

    // Transfer item ownership
    await Item.findByIdAndUpdate(swap.requestedItem, {
      owner: swap.requester,
      status: 'swapped'
    });
    await Item.findByIdAndUpdate(swap.offeredItem, {
      owner: swap.recipient,
      status: 'swapped'
    });

    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' }
    ]);

    successResponse(res, 'Swap completed successfully', swap);
  } catch (error) {
    console.error('Complete swap error:', error);
    errorResponse(res, 'Failed to complete swap', 500);
  }
};

// Cancel swap
exports.cancelSwap = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (!swap.canUserParticipate(userId)) {
      return errorResponse(res, 'Access denied', 403);
    }

    if (swap.status === 'completed') {
      return errorResponse(res, 'Cannot cancel completed swap', 400);
    }

    swap.status = 'cancelled';
    swap.cancelledAt = new Date();
    swap.cancelledBy = userId;
    await swap.save();

    // Return items to available status if they were in swap
    if (swap.status === 'accepted') {
      await Item.findByIdAndUpdate(swap.requestedItem, { status: 'available' });
      await Item.findByIdAndUpdate(swap.offeredItem, { status: 'available' });
    }

    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' }
    ]);

    successResponse(res, 'Swap cancelled successfully', swap);
  } catch (error) {
    console.error('Cancel swap error:', error);
    errorResponse(res, 'Failed to cancel swap', 500);
  }
};

// Send message in swap
exports.sendMessage = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return errorResponse(res, 'Message content is required', 400);
    }

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return errorResponse(res, 'Swap not found', 404);
    }

    if (!swap.canUserParticipate(userId)) {
      return errorResponse(res, 'Access denied', 403);
    }

    if (swap.status === 'completed' || swap.status === 'cancelled') {
      return errorResponse(res, 'Cannot send message to completed/cancelled swap', 400);
    }

    // Add message to swap
    swap.messages.push({
      sender: userId,
      content: content.trim()
    });

    await swap.save();

    await swap.populate([
      { path: 'requester', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'requestedItem', select: 'title description category pointsValue' },
      { path: 'offeredItem', select: 'title description category pointsValue' },
      { path: 'messages.sender', select: 'name' }
    ]);

    successResponse(res, 'Message sent successfully', swap);
  } catch (error) {
    console.error('Send message error:', error);
    errorResponse(res, 'Failed to send message', 500);
  }
};

// Get swap statistics
exports.getSwapStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Swap.aggregate([
      {
        $match: {
          $or: [
            { requester: mongoose.Types.ObjectId(userId) },
            { recipient: mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      pending: 0,
      accepted: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    successResponse(res, 'Swap statistics retrieved successfully', formattedStats);
  } catch (error) {
    console.error('Get swap stats error:', error);
    errorResponse(res, 'Failed to retrieve swap statistics', 500);
  }
}; 