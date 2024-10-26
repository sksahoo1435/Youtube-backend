const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: { type: String },
    channelBanner: { type: String },
    subscribers: {
        type: Number,
        default: 0,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
}, { timestamps: true })

// to convert _id to channelId
ChannelSchema.virtual('channelId').get(function() {
    return this._id.toString();
});


ChannelSchema.set('toJSON', { virtuals: true });
ChannelSchema.set('toObject', { virtuals: true });

const Channel = mongoose.model('Channel', ChannelSchema)

module.exports = Channel;