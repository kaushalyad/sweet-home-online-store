import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    address: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpires: Date,
    notificationSettings: {
        orderUpdates: { type: Boolean, default: true },
        promotionalOffers: { type: Boolean, default: true },
        newArrivals: { type: Boolean, default: true }
    },
    cartData: { 
        type: Object,
        default: {}
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
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