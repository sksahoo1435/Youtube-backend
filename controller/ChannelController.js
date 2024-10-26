const Channel = require('../model/ChannelSchema');
const User = require('../model/UserSchema')

exports.AddChannel = async (req, res) => {
    const { channelName, description, subscribers, videos } = req.body;
    const owner = req.user.userId;
    try {

        if (!req.files || !req.files.channelBanner) {
            return res.status(400).json({ message: 'Channel banner is required.' });
        }

        const channelBanner = req.files.channelBanner[0].path;

        const newChannel = new Channel({
            channelName,
            description,
            channelBanner: channelBanner,
            subscribers,
            owner,
            videos,
        });

        const users = await User.findById(owner)

        users.channels.push(newChannel._id)

        await users.save();
        await newChannel.save();

        return res.status(201).json({
            message: "Channel created successfully",
            channel: newChannel,
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

exports.getChannel = async (req, res) => {
    try {
        const channels = await Channel.find()
        return res.status(200).json({ message: "Channels Featched Successfully", channel: channels })
    } catch (error) {
        console.error("Error during get Channel:", error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.', error });
    }
}

exports.getChannelById = async (req, res) => {
    try {
        const id = req.params.id;

        const channel = await Channel.findById(id).populate('owner', 'username avatar');

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        return res.status(200).json({
            message: "Channel retrieved successfully",
            channel,
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while retrieving the channel', error });
    }
}

exports.updateChannel = async (req, res) => {
    try {
        const id = req.params.id;
        const { channelName, description, subscribers } = req.body;
        const channel = await Channel.findById(id);

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const userId = req.user.userId;

        if (userId.toString() !== (channel.owner._id).toString()) {
            return res.status(403).json({ message: "Forbidden." })
        }

        const updateData = {
            channelName,
            description,
            subscribers
        }

        const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        return res.status(200).json({
            message: "Channel Update successfully",
            channel: updatedChannel
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while retrieving the channel', error });
    }
}