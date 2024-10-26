const express = require('express');
const userRouter = express.Router();
const { AddUser, SignIn, GetUser } = require('../controller/UserController');
const { uploadFields } = require('../middlewire/uploader');


userRouter.post('/signup', uploadFields, AddUser);
userRouter.post('/login', SignIn)
userRouter.get('/user/:id', GetUser)

module.exports = userRouter;
