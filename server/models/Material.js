const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('Material', materialSchema);
