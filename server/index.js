const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config();
const userProfile = require('./models/User');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(compression());

// Add strong Content Security Policy (CSP) header
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Remove 'unsafe-inline' if possible
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4000"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  })
);

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