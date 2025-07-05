const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  // File identification
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  
  // Upload metadata
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  
  // GCS storage information
  gcsUrl: { type: String, required: true }, // gs://bucket-name/path
  publicUrl: { type: String, required: true }, // https://storage.googleapis.com/bucket-name/path
  signedUrl: { type: String }, // Temporary signed URL for secure access
  signedUrlExpires: { type: Date }, // When the signed URL expires
  
  // File organization
  filePath: { type: String, required: true }, // Path within GCS bucket
  bucketName: { type: String, required: true, default: 'course_content_materials' },
  
  // Access control
  isPublic: { type: Boolean, default: false },
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // File metadata
  description: { type: String },
  tags: [{ type: String }],
  category: { type: String, enum: ['lecture', 'assignment', 'reading', 'exam', 'other'], default: 'other' },
  
  // Usage tracking
  downloadCount: { type: Number, default: 0 },
  lastAccessed: { type: Date },
  
  // Status
  status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
MaterialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
MaterialSchema.index({ courseId: 1, uploadedBy: 1 });
MaterialSchema.index({ uploadDate: -1 });
MaterialSchema.index({ status: 1 });

// Virtual for file extension
MaterialSchema.virtual('fileExtension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Virtual for formatted file size
MaterialSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Method to check if user can access this file
MaterialSchema.methods.canAccess = function(userId) {
  if (this.isPublic) return true;
  if (this.uploadedBy.toString() === userId.toString()) return true;
  if (this.allowedUsers.some(id => id.toString() === userId.toString())) return true;
  return false;
};

// Method to generate new signed URL
MaterialSchema.methods.generateSignedUrl = async function() {
  const { Storage } = require('@google-cloud/storage');
  const path = require('path');
  const keyFilename = path.join(__dirname, '../gcs-key.json');
  const storage = new Storage({ keyFilename });
  const bucket = storage.bucket(this.bucketName);
  const file = bucket.file(this.filePath);
  
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
    version: 'v4'
  });
  
  this.signedUrl = signedUrl;
  this.signedUrlExpires = new Date(Date.now() + 60 * 60 * 1000);
  await this.save();
  
  return signedUrl;
};

// Method to increment download count
MaterialSchema.methods.incrementDownloadCount = async function() {
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  await this.save();
};

module.exports = mongoose.model('Material', MaterialSchema);
