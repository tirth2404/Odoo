const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Get pending items for approval
// @route   GET /api/admin/items/pending
// @access  Private (Admin only)
exports.getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({
      isApproved: false,
      status: 'available'
    })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve item
// @route   POST /api/admin/items/:id/approve
// @access  Private (Admin only)
exports.approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Item is already approved'
      });
    }

    item.isApproved = true;
    item.approvedBy = req.user._id;
    item.approvedAt = new Date();
    await item.save();

    res.json({
      success: true,
      message: 'Item approved successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject item
// @route   POST /api/admin/items/:id/reject
// @access  Private (Admin only)
exports.rejectItem = async (req, res) => {
  try {
    const { reason } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item.status = 'removed';
    item.isApproved = false;
    await item.save();

    res.json({
      success: true,
      message: 'Item rejected successfully',
      data: {
        itemId: item._id,
        reason: reason || 'Item did not meet community guidelines'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark item as featured
// @route   POST /api/admin/items/:id/feature
// @access  Private (Admin only)
exports.markAsFeatured = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!item.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot feature unapproved item'
      });
    }

    if (item.isFeatured) {
      return res.status(400).json({
        success: false,
        message: 'Item is already featured'
      });
    }

    await item.markAsFeatured(req.user._id);

    res.json({
      success: true,
      message: 'Item marked as featured successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove featured status
// @route   POST /api/admin/items/:id/unfeature
// @access  Private (Admin only)
exports.removeFeatured = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!item.isFeatured) {
      return res.status(400).json({
        success: false,
        message: 'Item is not featured'
      });
    }

    await item.removeFeatured();

    res.json({
      success: true,
      message: 'Featured status removed successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      pendingItems,
      featuredItems,
      totalSwaps
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ isApproved: false, status: 'available' }),
      Item.countDocuments({ isFeatured: true, isApproved: true }),
      // Swap.countDocuments() // Will add when we create Swap model
      0 // Placeholder for now
    ]);

    // Get category breakdown
    const categoryStats = await Item.aggregate([
      { $match: { isApproved: true, status: 'available' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalItems,
        pendingItems,
        featuredItems,
        totalSwaps,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 