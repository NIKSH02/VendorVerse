const mongoose = require('mongoose');

const MaterialRequestSchema = new mongoose.Schema({
    userId: {
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
        type: String
    },
    quantityRequired: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liters', 'pieces', 'grams', 'ml', 'dozens', 'packets']
    },
    willingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryNeeded: {
        type: Boolean,
        default: false
    },
    maxDeliveryFee: {
        type: Number,
        default: 0,
        min: 0
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    type: {
        type: String,
        required: true,
        enum: ['raw', 'half-baked', 'complete']
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'spices', 'sauces', 'containers', 'grains', 'dairy', 'meat', 'other']
    },
    description: {
        type: String,
        trim: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'fulfilled', 'expired', 'canceled'],
        default: 'open'
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {timestamps: true});

// Index for geospatial queries
MaterialRequestSchema.index({ "location.lat": 1, "location.lng": 1 });

// Index for filtering
MaterialRequestSchema.index({ type: 1, category: 1, status: 1, urgency: 1 });

// Index for expiration cleanup
MaterialRequestSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('MaterialRequest', MaterialRequestSchema);
