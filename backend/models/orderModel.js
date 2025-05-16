import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        size: { type: String },
        image: { type: String }
    }],
    totalAmount: { type: Number, required: true },
    amount: { type: Number, required: true },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        deliveryInstructions: { type: String },
        specialRequirements: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['Order Placed', 'Processing', 'Preparing', 'Packing', 'Quality Check', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'],
        default: 'Order Placed'
    },
    paymentMethod: { 
        type: String, 
        required: true,
        enum: ['cod', 'stripe', 'razorpay']
    },
    paymentStatus: { 
        type: String, 
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    additionalCosts: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    appliedCoupon: { type: String },
    date: { type: Number, required: true }
}, {
    timestamps: true
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;