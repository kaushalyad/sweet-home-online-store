import mongoose from 'mongoose';

const sharedContentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['product', 'collection', 'order', 'custom'],
    default: 'custom'
  },
  referenceId: {
    type: String,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Automatically delete after 30 days
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const SharedContent = mongoose.model('SharedContent', sharedContentSchema);

export default SharedContent; 