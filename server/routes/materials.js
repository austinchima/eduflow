const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const materialController = require('../controllers/materialController');
const auth = require('../middleware/auth');

// Set up multer for file uploads with enhanced configuration
const upload = multer({ 
  dest: 'tmp/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and media file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'text/html',
      'text/markdown',
      'text/x-markdown',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Upload material
router.post('/upload', auth, upload.single('file'), materialController.uploadMaterial);

// Get materials with filtering and search
router.get('/', auth, materialController.getMaterials);

// Download material by ID (generates signed URL)
router.get('/download/:id', auth, materialController.downloadMaterial);

// Update material metadata
router.put('/:id', auth, materialController.updateMaterial);

// Delete material by ID
router.delete('/:id', auth, materialController.deleteMaterial);

// Get material statistics
router.get('/stats', auth, materialController.getMaterialStats);

module.exports = router;
