const mongoose = require('mongoose');

const NegotiationSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
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
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        messageType: {
            type: String,
            enum: ['text', 'price-offer', 'system'],
            default: 'text'
        },
        priceOffer: {
            basePrice: Number,
            deliveryFee: Number,
            totalPrice: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        isRead: {
            type: Boolean,
            default: false
        }
    }],
    isNegotiated: {
        type: Boolean,
        default: false
    },
    finalPriceAgreed: {
        basePrice: Number,
        deliveryFee: Number,
        totalPrice: Number
    },
    negotiationStatus: {
        type: String,
        enum: ['active', 'agreed', 'canceled', 'expired'],
        default: 'active'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        }
    }
}, {timestamps: true});

// Update lastActivity on new messages
NegotiationSchema.pre('save', function(next) {
    if (this.isModified('messages')) {
        this.lastActivity = new Date();
    }
    next();
});

// Auto-delete completed negotiations after order completion
NegotiationSchema.statics.deleteCompletedNegotiations = async function() {
    const completedOrders = await mongoose.model('Order').find({ status: 'completed' }).select('_id');
    const orderIds = completedOrders.map(order => order._id);
    
    await this.deleteMany({ orderId: { $in: orderIds } });
};

// Indexes
NegotiationSchema.index({ orderId: 1 });
NegotiationSchema.index({ buyerId: 1, negotiationStatus: 1 });
NegotiationSchema.index({ sellerId: 1, negotiationStatus: 1 });
NegotiationSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Negotiation', NegotiationSchema);
