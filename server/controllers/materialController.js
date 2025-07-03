const Material = require('../models/Material');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');

// Helper to get GridFSBucket
function getGridFSBucket() {
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'materials' });
}

exports.uploadMaterial = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { originalname, mimetype, buffer, size } = req.file;
    // Store file in GridFS
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(originalname, { contentType: mimetype });
    uploadStream.end(buffer);
    uploadStream.on('finish', async (file) => {
      const material = new Material({
        userId,
        courseId,
        name: originalname,
        type: mimetype,
        gridFsFileId: file._id,
        size,
        uploadedAt: new Date(),
        metadata: req.body.metadata || {}
      });
      await material.save();
      res.json(material);
    });
    uploadStream.on('error', (err) => {
      res.status(500).json({ message: 'Failed to upload to GridFS', error: err.message });
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload material', error: err.message });
  }
};

// Stream file from GridFS by material ID
exports.downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(material.gridFsFileId);
    res.set('Content-Type', material.type);
    res.set('Content-Disposition', `attachment; filename=\"${material.name}\"`);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Failed to download material', error: err.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const { userId, courseId } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (courseId) query.courseId = courseId;
    const materials = await Material.find(query);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch materials', error: err.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Material.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Material not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update material', error: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Material.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete material', error: err.message });
  }
};
