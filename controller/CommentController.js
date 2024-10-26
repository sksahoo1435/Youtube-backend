const Comment = require('../model/CommentSchema');
const Video = require('../model/VedioSchema')

exports.AddComments = async (req, res) => {
    const { videoId, text } = req.body;

    try {
        const userId = req.user.userId;

        const newComment = new Comment({
            videoId,
            text,
            userId
        })

        newComment.commentId = newComment._id.toString();
        const video = await Video.findById(videoId)
        video.comments.push(newComment._id);
        await video.save();
        await newComment.save();

        return res.status(201).json({ message: "Comment Added.", comment: newComment })

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find();

        return res.status(200).json({ message: "Comments Fetched Successfully.", comment: comments })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

exports.getCommentById = async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(400).json({ message: "Comment Not Found" })
        }
        return res.status(200).json({ message: "Comment Find.", comment: comment })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });

    }
}

exports.updateComment = async (req, res) => {
    const id = req.params.id;
    const { text } = req.body
    try {
        const updatedComment = {
            text
        }

        const changeComment = await Comment.findByIdAndUpdate(id, updatedComment, { new: true, runValidators: true })
        return res.status(200).json({ message: "Comment Updated.", comment: changeComment })

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

exports.deleteComment = async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await Comment.findById(id);
        const userId = req.user.userId;
        if (!comment) {
            return res.status(400).json({ message: "Comment Not Found" })
        }

        console.log(userId, comment.userId);

        if (userId.toString() !== comment.userId.toString()) {
            return res.status(403).json({ message: "Forbidden. " })

        }

        const video = await Video.findById(comment.videoId)
        const deletedComment = await Comment.findByIdAndDelete(id);

        video.comments = video.comments.filter((v) => v.toString() !== deletedComment._id.toString());

        await video.save();

        return res.status(200).json({ message: "Comment Deleted.", comment: deletedComment })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}