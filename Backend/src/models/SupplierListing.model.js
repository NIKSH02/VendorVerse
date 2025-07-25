const mongoose = require('mongoose');

const SupplierListingSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liters', 'pieces', 'grams', 'ml', 'dozens', 'packets']
    },
    pricePerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAvailable: {
        type: Boolean,
        default: false
    },
    deliveryFee: {
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

// Index for geospatial queries
SupplierListingSchema.index({ "location.lat": 1, "location.lng": 1 });

// Index for filtering
SupplierListingSchema.index({ type: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('SupplierListing', SupplierListingSchema);
