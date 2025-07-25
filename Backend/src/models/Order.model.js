const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupplierListing'
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialRequest'
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liters', 'pieces', 'grams', 'ml', 'dozens', 'packets']
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryFee: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'negotiating', 'confirmed', 'in-progress', 'completed', 'canceled'],
        default: 'pending'
    },
    exchangeCodeBuyer: {
        type: String,
        unique: true,
        sparse: true
    },
    exchangeCodeSeller: {
        type: String,
        unique: true,
        sparse: true
    },
    deliveryType: {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },
    orderType: {
        type: String,
        enum: ['from-listing', 'from-request'],
        required: true
    },
    deliveryAddress: {
        type: String
    },
    pickupAddress: {
        type: String
    },
    expectedDeliveryDate: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    canceledAt: {
        type: Date
    },
    cancelReason: {
        type: String
    },
    notes: {
        type: String,
        trim: true
    }
}, {timestamps: true});

// Generate unique exchange codes before saving
OrderSchema.pre('save', async function(next) {
    if (this.status === 'confirmed' && !this.exchangeCodeBuyer) {
        this.exchangeCodeBuyer = Math.random().toString(36).substr(2, 8).toUpperCase();
        this.exchangeCodeSeller = Math.random().toString(36).substr(2, 8).toUpperCase();
    }
    if (this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

// Calculate total price before saving
OrderSchema.pre('save', function(next) {
    this.totalPrice = this.basePrice + this.deliveryFee;
    next();
});

// Indexes for efficient queries
OrderSchema.index({ buyerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
