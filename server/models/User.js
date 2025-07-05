const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  generatedUsername: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  studyGoal: { type: Number, default: 5 }, // hours per day
  targetGpa: { type: Number, default: 3.8 },
  notifications: { type: Boolean, default: true },
  theme: { type: String, default: 'light' },
  hasCompletedSetup: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
