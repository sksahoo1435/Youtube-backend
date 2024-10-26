const express = require('express'); 
const VideoRouter = express.Router(); 

// Import controller functions for managing video operations (CRUD and Download)
const { getVideos, uploadVedio, updateVideoData, deleteVideoData, downloadVideo,getVideosById } = require('../controller/VideoController');

// Import middleware for handling file uploads (e.g., videos, thumbnails)
const { uploadFields } = require('../middlewire/uploader'); 

// Import middleware for token authentication to secure specific routes
const authToken = require('../middlewire/authMiddlewire'); 

// Routes
VideoRouter.get('/', getVideos)
VideoRouter.get('/:id',getVideosById)
VideoRouter.get('/download/:id', downloadVideo)
VideoRouter.put('/', updateVideoData)
VideoRouter.post('/',authToken, uploadFields, uploadVedio);
VideoRouter.delete('/',authToken, deleteVideoData)


module.exports = VideoRouter;