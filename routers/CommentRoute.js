const express = require('express');
const { AddComments, getComments, getCommentById, updateComment, deleteComment } = require('../controller/CommentController');
const CommentRouter = express.Router();

CommentRouter.post('/', AddComments)
CommentRouter.get('/', getComments)
CommentRouter.get('/:id', getCommentById)
CommentRouter.put('/:id', updateComment)
CommentRouter.delete('/:id', deleteComment)

module.exports = CommentRouter;