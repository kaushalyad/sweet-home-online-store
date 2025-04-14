import mongoose from 'mongoose'

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

// Check if model already exists to prevent model overwrite error
const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
