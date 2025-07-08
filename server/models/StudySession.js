const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional: null for general study
  startTime: { type: Date, required: true }, // When the session started
  endTime: { type: Date, required: true },   // When the session ended
  duration: { type: Number, required: true }, // Duration in minutes
  activityType: { 
    type: String, 
    enum: ['reading', 'lecture', 'practice', 'quiz', 'review', 'other'], 
    default: 'other' 
  },
  notes: { type: String }, // Optional: user notes or tags
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudySession', studySessionSchema); 