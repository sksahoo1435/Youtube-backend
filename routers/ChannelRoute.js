const express = require('express')
const channelRouter = express.Router();
const {AddChannel,getChannel,getChannelById,updateChannel} = require('../controller/ChannelController');
const { uploadFields } = require('../middlewire/uploader');

channelRouter.post('/channel',uploadFields,AddChannel)
channelRouter.get('/channel',getChannel)
channelRouter.get('/channel/:id',getChannelById)
channelRouter.put('/channel/:id',updateChannel)

module.exports = channelRouter;
