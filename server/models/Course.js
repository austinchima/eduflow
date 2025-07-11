const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  instructor: String,
  credits: Number,
  semester: String,
  description: String,
  color: String,
  grade: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  modules: [
    {
      title: String,
      lessons: [
        {
          title: String,
          summary: String,
          keyPoints: [String],
          example: String,
          task: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Course', courseSchema);
