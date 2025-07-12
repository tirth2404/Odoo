const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    public_id: String,
    url: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
    }
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  points: {
    type: Number,
    default: 100 // Starting points for new users
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  swapHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap'
  }],
  itemsListed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add points method
userSchema.methods.addPoints = function(amount) {
  this.points += amount;
  return this.save();
};

// Deduct points method
userSchema.methods.deductPoints = function(amount) {
  if (this.points >= amount) {
    this.points -= amount;
    return this.save();
  }
  throw new Error('Insufficient points');
};

module.exports = mongoose.model('User', userSchema); 