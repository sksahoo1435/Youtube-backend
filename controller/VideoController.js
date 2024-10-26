const Videos = require('../model/VedioSchema');
const axios = require('axios');
const Channel = require('../model/ChannelSchema');
const { deleteFromCloudinary, generateDownloadUrl } = require('../middlewire/uploader');
const Comment = require('../model/CommentSchema');


exports.uploadVedio = async (req, res) => {
    try {
        const { title, description, views, likes, dislikes, channelId, category } = req.body;

        if (!req.files.thumbnail || !req.files.video) {
            return res.status(400).json({ message: 'Both video and thumbnail are required' });
        }

        const thumbnailUrl = req.files.thumbnail[0].path;
        const videoUrl = req.files.video[0].path;
        const uploaderId = req.user.userId;

        if (!uploaderId) {
            return res.status(400).json({ message: 'Channel ID and Uploader ID are required' });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }


        const newVideo = new Videos({
            title,
            thumbnailUrl,
            videoUrl,
            description,
            channelId,
            category,
            uploader: uploaderId,
            views: views || 0,
            likes: likes || 0,
            dislikes: dislikes || 0
        });

        newVideo.videoId = newVideo._id.toString();

        await newVideo.save();

        // Find related videos
        const relatedVideos = await Videos.find({
            _id: { $ne: newVideo._id }, // Exclude the newly created video
            $or: [
                { title: { $regex: newVideo.title, $options: 'i' } }, // Matching title
                { category: newVideo.category } // Matching category
            ]
        }).limit(10); // You can adjust the limit as needed

        // Store the related video IDs
        newVideo.recommended_videos = relatedVideos.map(video => video._id);
        await newVideo.save(); // Save the updated newVideo document

        channel.videos.push(newVideo._id);
        await channel.save();

        res.status(201).json({
            message: 'Video uploaded successfully',
            video: newVideo,
        });
    } catch (error) {
        console.error(error);
        // Attempt to delete the uploaded video and thumbnail in case of an error
        if (req.files) {
            const thumbnailPath = req.files.thumbnail ? req.files.thumbnail[0].path : null;
            const videoPath = req.files.video ? req.files.video[0].path : null;

            // Delete video and thumbnail from Cloudinary
            try {
                if (thumbnailPath) {
                    const publicId = extractPublicId(thumbnailPath);
                    await deleteFromCloudinary(publicId, 'image');
                }
                if (videoPath) {
                    const publicIdvideo = extractPublicId(videoPath);

                    await deleteFromCloudinary(publicIdvideo, 'video');
                }
            } catch (deleteError) {
                console.error('Error deleting files from Cloudinary:', deleteError);
            }
        }
        return res.status(500).json({ message: 'An error occurred while uploading the video', error });
    }
}

// exports.getVideos = async (req, res) => {
//     try {
//         const video = await Videos.find()
//         return res.status(200).json({ message: "Videos are Fetched Successfully", video: video })
//     } catch (error) {
//         return res.status(500).json({ message: 'An error occurred', error });
//     }
// }

exports.getVideos = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }


        // If category is provided and not 'all', filter by category
        if (category && category !== 'all') {
            query.category = category; // Filter by category
        }

        // Fetch videos based on the constructed query
        const videos = await Videos.find(query);

        return res.status(200).json({
            message: "Videos fetched successfully",
            videos: videos
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};

exports.getVideosById = async (req, res) => {
    try {
        const id = req.params.id;

        const video = await Videos.findById(id);

        return res.status(200).json({
            message: "Video fetched successfully",
            videos: video
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};


exports.updateVideoData = async (req, res) => {
    try {
        const { id } = req.body;
        const { title, description, views, likes, dislikes } = req.body;

        const update = {
            title,
            description,
            views,
            likes,
            dislikes
        };

        const updatedVideo = await Videos.findByIdAndUpdate(id, update, { new: true, runValidators: true })

        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

const extractPublicId = (url) => {
    const parts = url.split('/');
    const fileNameWithExtension = parts[parts.length - 1];
    const publicId = `${parts[parts.length - 2]}/${fileNameWithExtension.split('.')[0]}`;
    return publicId;
};

exports.deleteVideoData = async (req, res) => {

    try {
        const id = req.params.id;

        const userId = req.user.userId;

        const video = await Videos.findById(id)

        if (!video) {
            return res.status(400).json({ message: "Video Not Found." })
        }

        if (userId.toString() !== video.uploader.toString()) {
            return res.status(403).json({ message: "Forbidden" })
        }

        const deletedVideo = await Videos.findByIdAndDelete(id)

        await Comment.deleteMany({ videoId: id });

        if (!deletedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const channelId = deletedVideo?.channelId;
        const channel = await Channel.findById(channelId)

        if (channel) {
            channel.videos = channel.videos.filter(videoId => videoId.toString() !== deletedVideo._id.toString());
            await channel.save();
        }

        const publicId = extractPublicId(deletedVideo.thumbnailUrl);

        const publicIdvideo = extractPublicId(deletedVideo.videoUrl);

        await deleteFromCloudinary(publicIdvideo, 'video');
        await deleteFromCloudinary(publicId, 'image');

        return res.status(200).json({ message: "Video Deleted Successfully", video: deletedVideo })



    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

exports.downloadVideo = async (req, res) => {
    try {
        const id = req.params.id;

        const video = await Videos.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const publicId = extractPublicId(video.videoUrl);

        const downloadUrl = generateDownloadUrl(publicId, 'video');

        const response = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const sanitizedTitle = video.title.replace(/[<>:"/\\|?*]+/g, '');

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        response.data.pipe(res);

    } catch (error) {
        console.error('Error generating video download link:', error);
        return res.status(500).json({ message: 'Error generating video download link', error });
    }
};