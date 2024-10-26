const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true, 
    },
    avatar: {
        type: String,
        default: "https://picsum.photos/seed/picsum/200/300",
    },
    channels: [
        {
            type: String,
            ref: 'Channel',
        }
    ],
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;