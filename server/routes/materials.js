const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const materialController = require('../controllers/materialController');
const auth = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: multer.memoryStorage() });

// Upload material
router.post('/upload', auth, upload.single('file'), materialController.uploadMaterial);
// Get materials
router.get('/', auth, materialController.getMaterials);
// Download material by ID
router.get('/download/:id', auth, materialController.downloadMaterial);
// Update material by ID
router.put('/:id', auth, materialController.updateMaterial);
// Delete material by ID
router.delete('/:id', auth, materialController.deleteMaterial);

module.exports = router;
