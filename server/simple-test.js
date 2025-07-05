console.log('Simple test starting...');

// Test 1: Basic console output
console.log('✅ Console output working');

// Test 2: Environment variables
try {
  require('@dotenvx/dotenvx').config();
  console.log('✅ Environment variables loaded');
  console.log('GCS_BUCKET_NAME:', process.env.GCS_BUCKET_NAME);
} catch (error) {
  console.error('❌ Environment error:', error.message);
}

// Test 3: File system
try {
  const fs = require('fs');
  const path = require('path');
  const keyFile = path.join(__dirname, 'gcs-key.json');
  console.log('Key file path:', keyFile);
  console.log('Key file exists:', fs.existsSync(keyFile));
} catch (error) {
  console.error('❌ File system error:', error.message);
}

console.log('Simple test completed.'); 