const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  pointsExchange: {
    requesterPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    recipientPoints: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  messages: [messageSchema],
  requesterNote: {
    type: String,
    trim: true,
    maxlength: 200
  },
  recipientNote: {
    type: String,
    trim: true,
    maxlength: 200
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

// Virtual for total points exchange
swapSchema.virtual('totalPointsExchange').get(function() {
  return this.pointsExchange.requesterPoints + this.pointsExchange.recipientPoints;
});

// Pre-save middleware to validate swap
swapSchema.pre('save', function(next) {
  // Ensure requester and recipient are different
  if (this.requester.toString() === this.recipient.toString()) {
    return next(new Error('Cannot swap with yourself'));
  }
  
  // Ensure requested and offered items are different
  if (this.requestedItem.toString() === this.offeredItem.toString()) {
    return next(new Error('Cannot swap the same item'));
  }
  
  next();
});

// Method to check if user can participate in swap
swapSchema.methods.canUserParticipate = function(userId) {
  return this.requester.toString() === userId.toString() || 
         this.recipient.toString() === userId.toString();
};

// Method to get the other user in the swap
swapSchema.methods.getOtherUser = function(userId) {
  if (this.requester.toString() === userId.toString()) {
    return this.recipient;
  }
  return this.requester;
};

// Method to check if swap can be completed
swapSchema.methods.canComplete = function() {
  return this.status === 'accepted';
};

// Static method to get user's swaps
swapSchema.statics.getUserSwaps = function(userId, status = null) {
  const query = {
    $or: [
      { requester: userId },
      { recipient: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('requester', 'name email')
    .populate('recipient', 'name email')
    .populate('requestedItem', 'title description category pointsValue owner')
    .populate('offeredItem', 'title description category pointsValue owner')
    .populate('messages.sender', 'name')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Swap', swapSchema); 