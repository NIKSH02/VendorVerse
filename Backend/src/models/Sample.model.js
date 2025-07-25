const mongoose = require('mongoose');

const SampleSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'spices', 'sauces', 'containers', 'grains', 'dairy', 'meat', 'other']
    },
    type: {
        type: String,
        required: true,
        enum: ['raw', 'half-baked', 'complete']
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
    deliveryOrPickup: {
        type: String,
        enum: ['delivery', 'pickup'],
        required: true
    },
    deliveryAddress: {
        type: String
    },
    pickupAddress: {
        type: String
    },
    notes: {
        type: String,
        trim: true
    },
    dateGiven: {
        type: Date,
        default: Date.now
    },
    expectedDeliveryDate: {
        type: Date
    },
    actualDeliveryDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'received', 'reviewed'],
        default: 'pending'
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    exchangeCode: {
        type: String,
        unique: true,
        sparse: true
    }
}, {timestamps: true});

// Generate unique exchange code for sample delivery
SampleSchema.pre('save', function(next) {
    if (this.status === 'delivered' && !this.exchangeCode) {
        this.exchangeCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    next();
});

// Middleware to prevent user access if they have unreviewed samples
SampleSchema.statics.hasUnreviewedSamples = async function(userId) {
    const unreviewed = await this.findOne({ 
        receiverId: userId, 
        status: 'received',
        isReviewed: false 
    });
    return !!unreviewed;
};

// Indexes
SampleSchema.index({ supplierId: 1, status: 1 });
SampleSchema.index({ receiverId: 1, isReviewed: 1 });
SampleSchema.index({ status: 1, dateGiven: -1 });

module.exports = mongoose.model('Sample', SampleSchema);
