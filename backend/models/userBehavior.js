import mongoose from 'mongoose';

const userBehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous tracking
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  query: {
    type: Object,
    default: {}
  },
  referrer: {
    type: String,
    default: 'direct'
  },
  ip: {
    type: String,
    required: true
  },
  deviceInfo: {
    isMobile: Boolean,
    isTablet: Boolean,
    isDesktop: Boolean,
    browser: String,
    os: String
  },
  sessionDuration: {
    type: Number,
    default: 0
  },
  userAgent: String,
  // Additional tracking fields
  scrollDepth: {
    type: Number,
    default: 0
  },
  timeOnPage: {
    type: Number,
    default: 0
  },
  interactions: [{
    type: {
      type: String,
      enum: ['click', 'hover', 'scroll', 'form_submit', 'search']
    },
    element: String,
    timestamp: Date,
    details: Object
  }],
  // E-commerce specific fields
  cartActions: [{
    type: {
      type: String,
      enum: ['add', 'remove', 'update']
    },
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    timestamp: Date
  }],
  wishlistActions: [{
    type: {
      type: String,
      enum: ['add', 'remove']
    },
    productId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  }],
  searchHistory: [{
    query: String,
    results: Number,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
userBehaviorSchema.index({ userId: 1, timestamp: -1 });
userBehaviorSchema.index({ path: 1, timestamp: -1 });
userBehaviorSchema.index({ 'deviceInfo.browser': 1, timestamp: -1 });
userBehaviorSchema.index({ 'deviceInfo.os': 1, timestamp: -1 });

const UserBehavior = mongoose.model('UserBehavior', userBehaviorSchema);

export default UserBehavior; 