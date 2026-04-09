import mongoose from 'mongoose'

const reviewMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    publicId: { type: String }
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    media: { type: [reviewMediaSchema], default: [] },
    verifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true },
    subCategory: { type: String },
    image: { type: Array, required: true },
    stock: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    ingredients: { type: String },
    nutrition: { type: String },
    weight: { type: String },
    shelfLife: { type: String },
    storage: { type: String },
    tags: { type: Array, default: [] },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    totalSold: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
}, { minimize: false });

// Method to calculate discounted price
productSchema.methods.getDiscountedPrice = function() {
    if (this.discountPrice) {
        return this.discountPrice;
    }
    return this.price;
};

productSchema.methods.recalculateRating = function () {
  if (!Array.isArray(this.reviews) || this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  this.totalReviews = this.reviews.length;
  this.rating = Number((sum / this.totalReviews).toFixed(2));
};

// Check if model already exists to prevent model overwrite error
const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
