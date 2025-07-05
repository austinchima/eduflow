require('@dotenvx/dotenvx').config();
const { uploadFileToGCS } = require('./utils/gcsUpload');
const fs = require('fs');
const path = require('path');

// Create a test file
const testContent = 'This is a test file for GCS upload';
const testFilePath = path.join(__dirname, 'test-upload.txt');

// Write test file
fs.writeFileSync(testFilePath, testContent);

// Mock file object (similar to what multer provides)
const mockFile = {
  path: testFilePath,
  originalname: 'test-upload.txt',
  mimetype: 'text/plain',
  size: testContent.length
};

async function testUpload() {
  try {
    console.log('Testing GCS upload...');
    
    const result = await uploadFileToGCS(mockFile, 'test-user-id', 'test-course-id');
    
    console.log('✅ Upload successful!');
    console.log('GCS URL:', result.gcsUrl);
    console.log('Signed URL:', result.signedUrl);
    console.log('Metadata:', result.metadata);
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    
    // Clean up test file even if upload fails
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

testUpload(); 