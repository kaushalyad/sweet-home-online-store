import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validUntil: Date
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  brand: {
    type: String
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'g'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'm', 'in'],
      default: 'cm'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'ratings.average': -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount.percentage > 0 && (!this.discount.validUntil || this.discount.validUntil > new Date())) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Method to update average rating
productSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

const Product = mongoose.model('Product', productSchema);

export default Product; 