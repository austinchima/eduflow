console.log('Starting GCS configuration test...');

try {
  require('@dotenvx/dotenvx').config();
  console.log('✅ Environment variables loaded');
} catch (error) {
  console.error('❌ Error loading environment variables:', error.message);
  return;
}

try {
  const { Storage } = require('@google-cloud/storage');
  console.log('✅ Google Cloud Storage module loaded');
} catch (error) {
  console.error('❌ Error loading Google Cloud Storage module:', error.message);
  return;
}

const path = require('path');

// Test GCS configuration
async function testGCSConfig() {
  try {
    console.log('Testing GCS configuration...');
    
    // Check environment variables
    const bucketName = process.env.GCS_BUCKET_NAME || 'course_content_materials';
    console.log('Bucket name:', bucketName);
    
    // Check if key file exists
    const keyFilename = path.join(__dirname, 'gcs-key.json');
    const fs = require('fs');
    if (!fs.existsSync(keyFilename)) {
      console.error('❌ GCS key file not found at:', keyFilename);
      return;
    }
    console.log('✅ GCS key file found');
    
    // Test Storage initialization
    const storage = new Storage({ keyFilename });
    console.log('✅ Storage initialized');
    
    // Test bucket access
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log('✅ Bucket exists and is accessible');
    } else {
      console.log('❌ Bucket does not exist or is not accessible');
      console.log('Please create the bucket:', bucketName);
    }
    
  } catch (error) {
    console.error('❌ GCS configuration error:', error.message);
  }
}

testGCSConfig(); 