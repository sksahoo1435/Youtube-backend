const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['music', 'sports', 'news', 'technology', 'comedy', 'cooking', 'shorts', 'education', 'others'],
        required: true
    },
    recommended_videos:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    description: {
        type: String
    },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });


const Videos = mongoose.model('Video', videoSchema)

module.exports = Videos;