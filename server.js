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
const PORT = process.env.PORT || 3000; // Fix: Use a valid port number

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());

// CORS setup
const allowedOrigins = [
  'http://localhost:5173', // Local development frontend
  'https://you-tube-frontend-ashen.vercel.app', // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'YouTube Backend is running successfully.' });
});

// API routes
app.use('/user', UserRouter);
app.use('/video', VideoRouter);
app.use('/comment', CommentRouter);
app.use('/channel', authToken, ChannelRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Adjusted console message
});
