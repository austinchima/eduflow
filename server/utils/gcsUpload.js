const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Path to your service account key
const keyFilename = path.join(__dirname, '../gcs-key.json');
const storage = new Storage({ keyFilename });
const bucketName = process.env.GCS_BUCKET_NAME || 'course_content_materials'; // Configurable bucket name

/**
 * Upload file to Google Cloud Storage with proper metadata
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID for access control
 * @param {string} courseId - Course ID for organization
 * @returns {Object} File metadata and GCS URL
 */
async function uploadFileToGCS(file, userId, courseId) {
  try {
    // Generate unique filename with timestamp and user info
    const timestamp = Date.now();
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const destination = `uploads/${userId}/${courseId}/${timestamp}-${safeFilename}`;
    
    console.log(`Uploading file to GCS: ${destination}`);
    
    // Upload file to GCS
    const [uploadedFile] = await storage.bucket(bucketName).upload(file.path, {
      destination,
      public: false, // Keep files private
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          courseId: courseId,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size
        }
      },
      resumable: true // Enable resumable uploads for large files
    });

    // Clean up temp file
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    // Generate signed URL for secure access (expires in 1 hour)
    const [signedUrl] = await uploadedFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
      version: 'v4'
    });

    return {
      gcsUrl: `gs://${bucketName}/${destination}`,
      publicUrl: `https://storage.googleapis.com/${bucketName}/${destination}`,
      signedUrl: signedUrl,
      metadata: {
        filename: uploadedFile.name,
        originalName: file.originalname,
        size: file.size,
        contentType: file.mimetype,
        uploadedBy: userId,
        courseId: courseId,
        uploadedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('GCS upload error:', error);
    throw new Error(`Failed to upload file to GCS: ${error.message}`);
  }
}

/**
 * Note: IAM permissions are not needed for this implementation
 * Files are stored privately and accessed via signed URLs
 * The service account only needs storage.objectAdmin permissions
 */

/**
 * Delete file from GCS
 * @param {string} filePath - File path in GCS bucket
 */
async function deleteFileFromGCS(filePath) {
  try {
    const bucket = storage.bucket(bucketName);
    await bucket.file(filePath).delete();
    console.log(`File deleted from GCS: ${filePath}`);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw new Error(`Failed to delete file from GCS: ${error.message}`);
  }
}

/**
 * Delete entire course folder from GCS
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Object} Deletion result with count of deleted files
 */
async function deleteCourseFolderFromGCS(userId, courseId) {
  try {
    const bucket = storage.bucket(bucketName);
    const courseFolderPrefix = `uploads/${userId}/${courseId}/`;
    
    console.log(`Deleting course folder from GCS: ${courseFolderPrefix}`);
    
    // List all files in the course folder
    const [files] = await bucket.getFiles({ prefix: courseFolderPrefix });
    
    if (files.length === 0) {
      console.log(`No files found in course folder: ${courseFolderPrefix}`);
      return { deletedCount: 0, message: 'No files found in course folder' };
    }
    
    // Delete all files in the folder
    const deletePromises = files.map(file => file.delete());
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted ${files.length} files from course folder: ${courseFolderPrefix}`);
    
    return { 
      deletedCount: files.length, 
      message: `Successfully deleted ${files.length} files from course folder` 
    };
  } catch (error) {
    console.error('Error deleting course folder from GCS:', error);
    throw new Error(`Failed to delete course folder from GCS: ${error.message}`);
  }
}

module.exports = {
  uploadFileToGCS,
  deleteFileFromGCS,
  deleteCourseFolderFromGCS
}; 