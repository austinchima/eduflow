const Material = require('../models/Material');
const mongoose = require('mongoose');
const { 
  uploadFileToGCS, 
  deleteFileFromGCS 
} = require('../utils/gcsUpload');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const csvParser = require('csv-parser');
const fs = require('fs');

// Helper to get GridFSBucket
function getGridFSBucket() {
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'materials' });
}

exports.uploadMaterial = async (req, res) => {
  try {
    const { courseId, description, category, tags } = req.body;
    const userId = req.user.id; // from auth middleware
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    console.log(`Uploading material for user ${userId}, course ${courseId}`);
    
    // Upload to GCS with enhanced metadata
    const uploadResult = await uploadFileToGCS(req.file, userId, courseId);
    
    // Extract text content from file
    let extractedText = '';
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    try {
      if (mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
        console.log(`Extracted ${extractedText.length} characters from PDF`);
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        extractedText = result.value;
        console.log(`Extracted ${extractedText.length} characters from Word document`);
      } else if (mimetype === 'text/csv') {
        // Handle CSV files
        const results = [];
        extractedText = await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
              // Convert CSV data to text format
              const csvText = results.map(row => Object.values(row).join(', ')).join('\n');
              resolve(csvText);
            })
            .on('error', reject);
        });
        console.log(`Extracted ${extractedText.length} characters from CSV file`);
      } else if (mimetype.startsWith('text/') || mimetype === 'text/html' || mimetype === 'text/markdown' || mimetype === 'text/x-markdown') {
        // Handle plain text files, HTML, and markdown files
        extractedText = fs.readFileSync(filePath, 'utf8');
        
        // For markdown files, we can optionally strip markdown formatting
        if (mimetype === 'text/markdown' || mimetype === 'text/x-markdown' || req.file.originalname.toLowerCase().endsWith('.md')) {
          // Basic markdown stripping - remove headers, bold, italic, links, etc.
          extractedText = extractedText
            .replace(/^#{1,6}\s+/gm, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
            .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
            .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
            .trim();
        }
        
        console.log(`Extracted ${extractedText.length} characters from ${mimetype} file`);
      } else if (mimetype === 'application/msword' || mimetype === 'application/rtf') {
        // For older Word documents and RTF files, we'll skip text extraction for now
        // as they require additional libraries that might have security issues
        extractedText = '';
        console.log(`Text extraction not supported for ${mimetype} files`);
      } else {
        extractedText = '';
        console.log(`No text extraction implemented for ${mimetype} files`);
      }
    } catch (extractErr) {
      console.error('Text extraction error:', extractErr);
      extractedText = '';
    }
    
    // Note: IAM permissions are not needed for signed URL access
    // Files are stored privately and accessed via signed URLs
    
    // Save comprehensive metadata in MongoDB
    const material = new Material({
      filename: uploadResult.metadata.filename,
      originalName: uploadResult.metadata.originalName,
      size: uploadResult.metadata.size,
      mimetype: uploadResult.metadata.contentType,
      courseId,
      uploadedBy: userId,
      uploadDate: new Date(),
      
      // GCS storage information
      gcsUrl: uploadResult.gcsUrl,
      publicUrl: uploadResult.publicUrl,
      signedUrl: uploadResult.signedUrl,
      signedUrlExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      filePath: uploadResult.metadata.filename,
      bucketName: process.env.GCS_BUCKET_NAME || 'course_content_materials',
      
      // File metadata
      description: description || '',
      category: category || 'other',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      
      // Access control
      isPublic: false,
      allowedUsers: [userId],
      text: extractedText
    });
    
    await material.save();
    
    console.log(`Material uploaded successfully: ${material._id}`);
    
    res.status(201).json({
      message: 'Material uploaded successfully',
      material: {
        id: material._id,
        filename: material.filename,
        originalName: material.originalName,
        size: material.size,
        formattedSize: material.formattedSize,
        mimetype: material.mimetype,
        uploadDate: material.uploadDate,
        description: material.description,
        category: material.category,
        tags: material.tags,
        downloadCount: material.downloadCount,
        signedUrl: material.signedUrl,
        text: material.text
      }
    });
    
  } catch (err) {
    console.error('Upload material error:', err);
    res.status(500).json({ 
      message: 'Failed to upload material', 
      error: err.message 
    });
  }
};

// Get materials with access control
exports.getMaterials = async (req, res) => {
  try {
    const { courseId, category, search } = req.query;
    const userId = req.user.id;
    
    let query = { status: 'active' };
    
    // Filter by course if specified
    if (courseId) {
      query.courseId = courseId;
    }
    
    // Filter by category if specified
    if (category) {
      query.category = category;
    }
    
    // Search in filename, originalName, description, or tags
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Get materials that the user can access
    const materials = await Material.find(query)
      .populate('uploadedBy', 'firstName lastName username')
      .populate('courseId', 'name code')
      .sort({ uploadDate: -1 });
    
    // Filter materials based on access permissions
    const accessibleMaterials = materials.filter(material => 
      material.canAccess(userId)
    );
    
    // Generate fresh signed URLs for accessible materials
    const materialsWithUrls = await Promise.all(
      accessibleMaterials.map(async (material) => {
        // Check if signed URL is expired or doesn't exist
        if (!material.signedUrl || 
            !material.signedUrlExpires || 
            material.signedUrlExpires < new Date()) {
          try {
            await material.generateSignedUrl();
          } catch (error) {
            console.error(`Error generating signed URL for material ${material._id}:`, error);
          }
        }
        
        return {
          id: material._id,
          filename: material.filename,
          originalName: material.originalName,
          size: material.size,
          formattedSize: material.formattedSize,
          mimetype: material.mimetype,
          uploadDate: material.uploadDate,
          description: material.description,
          category: material.category,
          tags: material.tags,
          downloadCount: material.downloadCount,
          lastAccessed: material.lastAccessed,
          uploadedBy: material.uploadedBy,
          courseId: material.courseId,
          signedUrl: material.signedUrl,
          canAccess: true
        };
      })
    );
    
    res.json({
      materials: materialsWithUrls,
      total: materialsWithUrls.length
    });
    
  } catch (err) {
    console.error('Get materials error:', err);
    res.status(500).json({ 
      message: 'Failed to fetch materials', 
      error: err.message 
    });
  }
};

// Download material with access control and usage tracking
exports.downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const material = await Material.findById(id)
      .populate('uploadedBy', 'firstName lastName username')
      .populate('courseId', 'name code');
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check access permissions
    if (!material.canAccess(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Generate fresh signed URL if needed
    if (!material.signedUrl || 
        !material.signedUrlExpires || 
        material.signedUrlExpires < new Date()) {
      await material.generateSignedUrl();
    }
    
    // Increment download count
    await material.incrementDownloadCount();
    
    res.json({
      message: 'Download URL generated',
      material: {
        id: material._id,
        originalName: material.originalName,
        size: material.size,
        formattedSize: material.formattedSize,
        mimetype: material.mimetype,
        downloadCount: material.downloadCount,
        signedUrl: material.signedUrl,
        expiresAt: material.signedUrlExpires
      }
    });
    
  } catch (err) {
    console.error('Download material error:', err);
    res.status(500).json({ 
      message: 'Failed to generate download URL', 
      error: err.message 
    });
  }
};

// Update material metadata
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, category, tags, isPublic, allowedUsers } = req.body;
    
    const material = await Material.findById(id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Only allow updates by the uploader or course instructor
    if (material.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (allowedUsers !== undefined) updateData.allowedUsers = allowedUsers;
    
    const updated = await Material.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).populate('uploadedBy', 'firstName lastName username')
     .populate('courseId', 'name code');
    
    res.json({
      message: 'Material updated successfully',
      material: updated
    });
    
  } catch (err) {
    console.error('Update material error:', err);
    res.status(500).json({ 
      message: 'Failed to update material', 
      error: err.message 
    });
  }
};

// Delete material with GCS cleanup
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const material = await Material.findById(id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Only allow deletion by the uploader or course instructor
    if (material.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete from GCS
    try {
      await deleteFileFromGCS(material.filePath);
    } catch (gcsError) {
      console.error('GCS deletion error:', gcsError);
      // Continue with MongoDB deletion even if GCS deletion fails
    }
    
    // Note: IAM permissions are not needed for signed URL access
    
    // Soft delete from MongoDB
    material.status = 'deleted';
    await material.save();
    
    res.json({ 
      message: 'Material deleted successfully',
      materialId: material._id
    });
    
  } catch (err) {
    console.error('Delete material error:', err);
    res.status(500).json({ 
      message: 'Failed to delete material', 
      error: err.message 
    });
  }
};

// Get material statistics
exports.getMaterialStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.query;
    
    let query = { uploadedBy: userId, status: 'active' };
    if (courseId) query.courseId = courseId;
    
    const stats = await Material.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          totalDownloads: { $sum: '$downloadCount' },
          categories: { $addToSet: '$category' }
        }
      }
    ]);
    
    const categoryStats = await Material.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      stats: stats[0] || { totalFiles: 0, totalSize: 0, totalDownloads: 0, categories: [] },
      categoryStats
    });
    
  } catch (err) {
    console.error('Get material stats error:', err);
    res.status(500).json({ 
      message: 'Failed to fetch material statistics', 
      error: err.message 
    });
  }
};
