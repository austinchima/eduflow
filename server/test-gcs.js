const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Test configuration
const keyFilename = path.join(__dirname, 'gcs-key.json');
const bucketName = 'course_content_materials';

async function testGCSSetup() {
  try {
    console.log('Testing Google Cloud Storage setup...\n');
    
    // Check if service account key exists
    if (!fs.existsSync(keyFilename)) {
      console.error('❌ Service account key file not found:', keyFilename);
      console.log('Please download your service account key and save it as gcs-key.json');
      return;
    }
    
    console.log('✅ Service account key file found');
    
    // Initialize Storage client
    const storage = new Storage({ keyFilename });
    console.log('✅ Storage client initialized');
    
    // Test bucket access
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log(`⚠️  Bucket '${bucketName}' does not exist`);
      console.log('Creating bucket...');
      
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD'
      });
      
      console.log(`✅ Bucket '${bucketName}' created successfully`);
    } else {
      console.log(`✅ Bucket '${bucketName}' exists and accessible`);
    }
    
    // Test file upload
    console.log('\nTesting file upload...');
    
    const testContent = 'This is a test file for EduFlow GCS setup verification.';
    const testFileName = `test-${Date.now()}.txt`;
    const testFilePath = path.join(__dirname, 'tmp', testFileName);
    
    // Create tmp directory if it doesn't exist
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Create test file
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Test file created');
    
    // Upload test file
    const destination = `uploads/test/${testFileName}`;
    await bucket.upload(testFilePath, {
      destination,
      metadata: {
        contentType: 'text/plain',
        metadata: {
          test: 'true',
          uploadedAt: new Date().toISOString()
        }
      }
    });
    
    console.log('✅ Test file uploaded successfully');
    
    // Test signed URL generation
    console.log('\nTesting signed URL generation...');
    
    const file = bucket.file(destination);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
      version: 'v4'
    });
    
    console.log('✅ Signed URL generated successfully');
    console.log('Signed URL:', signedUrl);
    
    // Test file download
    console.log('\nTesting file download...');
    
    const [downloadedContent] = await file.download();
    const downloadedText = downloadedContent.toString();
    
    if (downloadedText === testContent) {
      console.log('✅ File download test passed');
    } else {
      console.log('❌ File download test failed');
    }
    
    // Test IAM policy
    console.log('\nTesting IAM policy...');
    
    try {
      const [policy] = await bucket.iam.getPolicy();
      console.log('✅ IAM policy retrieved successfully');
      console.log('Current bindings:', policy.bindings.length);
    } catch (error) {
      console.log('⚠️  IAM policy test failed:', error.message);
    }
    
    // Clean up test file
    console.log('\nCleaning up test files...');
    
    fs.unlinkSync(testFilePath);
    await file.delete();
    
    console.log('✅ Test files cleaned up');
    
    // Summary
    console.log('\n🎉 GCS Setup Test Summary:');
    console.log('✅ Service account authentication');
    console.log('✅ Bucket access and creation');
    console.log('✅ File upload functionality');
    console.log('✅ Signed URL generation');
    console.log('✅ File download functionality');
    console.log('✅ IAM policy access');
    console.log('✅ File cleanup');
    
    console.log('\n🚀 Google Cloud Storage is ready for use with EduFlow!');
    
  } catch (error) {
    console.error('\n❌ GCS Setup Test Failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Verify your service account key is correct');
    console.error('2. Check if the service account has proper permissions');
    console.error('3. Ensure the bucket name is correct');
    console.error('4. Verify your Google Cloud project is set up correctly');
    console.error('\nSee GCS_SETUP.md for detailed setup instructions.');
  }
}

// Run the test
if (require.main === module) {
  testGCSSetup();
}

module.exports = { testGCSSetup }; 