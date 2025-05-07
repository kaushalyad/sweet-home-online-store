import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    notificationSettings: {
        orderUpdates: { type: Boolean, default: true },
        promotionalOffers: { type: Boolean, default: true },
        newArrivals: { type: Boolean, default: true }
    },
    cartData: { 
        type: Object,
        default: {}
    }
}, { 
    minimize: false,
    timestamps: true 
});

// Pre-save middleware to ensure cartData is always an object
userSchema.pre('save', function(next) {
    if (!this.cartData || typeof this.cartData !== 'object') {
        this.cartData = {};
    }
    next();
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;