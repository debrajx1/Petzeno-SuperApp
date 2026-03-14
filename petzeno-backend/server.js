const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');
const { router: apiRoutes } = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const sosRoutes = require('./routes/sosRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Petzeno Backend is running!' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false, // Disable buffering so it fails fast instead of hanging
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
})
.catch((err) => {
  console.error('CRITICAL: MongoDB connection failed.', err.message);
  if (err.message.includes('ECONNREFUSED')) {
    console.log('--- NETWORK ALERT ---');
    console.log('Your Internet Service Provider (ISP) is blocking MongoDB Atlas Ports.');
    console.log('Try using a mobile hotspot or run "node force_seed.js" manually.');
  }
  console.log('Running in Fallback Mode (Mock data will be used).');
});

// Always listen so the API still works (routes have MOCK_DB fallbacks or will just return empty arrays instead of crashing)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT} (LAN accessible)`);
});
