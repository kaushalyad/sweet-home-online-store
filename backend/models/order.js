import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    name: String,
    size: String,
    image: [String]
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'Order Placed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  additionalCosts: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order; 