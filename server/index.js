const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config();
require('dotenv').config();
const userProfile = require('./models/User');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure NODE_ENV is set, default to 'production' if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log(`Running in ${process.env.NODE_ENV} mode`);

app.use(helmet());

// Configure CORS for production
const allowedOrigin = process.env.FRONTEND_URL || '*'; // Set FRONTEND_URL in Render to your Netlify site URL
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (allowedOrigin === '*' || origin === allowedOrigin || origin === allowedOrigin.replace(/\/$/, '')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(compression());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Root route handler
app.get('/', (req, res) => {
  res.send('Eduflow AI backend is running.');
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// AI routes
app.use('/api/ai', require('./routes/ai'));
// Materials routes
app.use('/api/materials', require('./routes/materials'));
// Courses routes
app.use('/api/courses', require('./routes/courses'));

// Study sessions routes
app.use('/api/study-sessions', require('./routes/studySessions'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});