const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const VideoSchema = new mongoose.Schema({
    videofile: {
        type: String, // URL
        required: true
    },
    thumbnail: {
        type: String, // URL
        required: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

// Apply the plugin to the schema
VideoSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('Video', VideoSchema);