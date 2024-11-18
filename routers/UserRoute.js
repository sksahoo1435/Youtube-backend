const express = require('express');
const userRouter = express.Router();
const { AddUser, SignIn, GetUser, GetUserNameById } = require('../controller/UserController');
const { uploadFields } = require('../middlewire/uploader');


userRouter.post('/signup', uploadFields, AddUser);
userRouter.post('/login', SignIn)
userRouter.get('/user/:id', GetUser)
userRouter.get('/username/:id',GetUserNameById)

module.exports = userRouter;
