const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Root route handler
app.get('/', (req, res) => {
  res.send('Eduflow AI backend is running.');
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// AI routes
app.use('/api/ai', require('./routes/ai'));
// Materials routes
app.use('/api/materials', require('./routes/materials'));
// Courses routes
app.use('/', require('./routes/courses'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});