const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ["men's clothing", "women's clothing", "kids", "accessories", "footwear", "outerwear"]
  },
  subcategory: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['casual', 'formal', 'sportswear', 'vintage', 'designer', 'other']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  brand: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'all-season']
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: String,
    url: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointsValue: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [10, 'Minimum points value is 10'],
    max: [1000, 'Maximum points value is 1000']
  },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'pending', 'swapped', 'removed']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featuredAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  swapRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap'
  }],
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search functionality
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Index for featured items
itemSchema.index({ isFeatured: 1, createdAt: -1 });

// Index for category filtering
itemSchema.index({ category: 1, status: 1, isApproved: 1 });

// Virtual for like count
itemSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for swap request count
itemSchema.virtual('swapRequestCount').get(function() {
  return this.swapRequests.length;
});

// Ensure virtuals are serialized
itemSchema.set('toJSON', { virtuals: true });

// Method to increment views
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
itemSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to mark as featured (admin only)
itemSchema.methods.markAsFeatured = function(adminId) {
  this.isFeatured = true;
  this.featuredBy = adminId;
  this.featuredAt = new Date();
  return this.save();
};

// Method to remove featured status
itemSchema.methods.removeFeatured = function() {
  this.isFeatured = false;
  this.featuredBy = null;
  this.featuredAt = null;
  return this.save();
};

module.exports = mongoose.model('Item', itemSchema); 