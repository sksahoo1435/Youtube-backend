const express = require('express');
const { AddComments, getComments, getCommentById, updateComment, deleteComment } = require('../controller/CommentController');
const CommentRouter = express.Router();
const authToken = require('../middlewire/authMiddlewire')


CommentRouter.get('/all/:videoId', getComments)
CommentRouter.get('/:id', getCommentById)
CommentRouter.post('/', authToken, AddComments)
CommentRouter.put('/:id', authToken, updateComment)
CommentRouter.delete('/:id', authToken, deleteComment)

module.exports = CommentRouter;