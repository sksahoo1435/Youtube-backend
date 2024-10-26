const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectToDatabase = require('./middlewire/DbConnecter');
const UserRouter = require('./routers/UserRoute')
const ChannelRouter = require('./routers/ChannelRoute')
const VideoRouter = require('./routers/VideoRouter')
const CommentRouter = require('./routers/CommentRoute')
const authToken = require('./middlewire/authMiddlewire')

dotenv.config();

const app = express();


// middlewires
connectToDatabase();

app.use(express.json());
app.use(cors())


//Routers

app.use('/', UserRouter)
app.use('/video', VideoRouter)
app.use('/', authToken, ChannelRouter)
app.use('/comment', authToken, CommentRouter)

app.listen(process.env.PORT || 4008, () => {
    console.log("Server started")
})