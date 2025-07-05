const { deleteCourseFolderFromGCS } = require('./utils/gcsUpload');

/**
 * Test script to verify course deletion functionality
 * This script tests the deleteCourseFolderFromGCS function
 */

async function testCourseDeletion() {
  try {
    console.log('Testing course deletion functionality...\n');
    
    // Test parameters
    const testUserId = 'test-user-123';
    const testCourseId = 'test-course-456';
    
    console.log(`Testing deletion of course folder: uploads/${testUserId}/${testCourseId}/`);
    
    // Test the deletion function
    const result = await deleteCourseFolderFromGCS(testUserId, testCourseId);
    
    console.log('✅ Course deletion test completed successfully!');
    console.log('Result:', result);
    
    if (result.deletedCount > 0) {
      console.log(`📁 Successfully deleted ${result.deletedCount} files from course folder`);
    } else {
      console.log('📁 No files found in course folder (expected for test)');
    }
    
  } catch (error) {
    console.error('❌ Course deletion test failed:', error.message);
    
    // Check if it's a permission error
    if (error.message.includes('permission') || error.message.includes('access')) {
      console.log('\n💡 This might be a permissions issue. Please check:');
      console.log('1. GCS service account key file exists and is valid');
      console.log('2. Service account has storage.objectAdmin permissions');
      console.log('3. Bucket exists and is accessible');
    }
  }
}

// Run the test
if (require.main === module) {
  testCourseDeletion();
}

module.exports = { testCourseDeletion }; 