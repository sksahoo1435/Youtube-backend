const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('./middlewire/DbConnecter');
const UserRouter = require('./routers/UserRoute');
const ChannelRouter = require('./routers/ChannelRoute');
const VideoRouter = require('./routers/VideoRouter');
const CommentRouter = require('./routers/CommentRoute');
const authToken = require('./middlewire/authMiddlewire');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4008;

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-domain.com','https://youtube-frontend-gray.vercel.app/'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use('/user', UserRouter); 
app.use('/video', VideoRouter);
app.use('/channel', authToken, ChannelRouter);
app.use('/comment', authToken, CommentRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
