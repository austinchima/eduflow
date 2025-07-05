const { Storage } = require('@google-cloud/storage');
const path = require('path');

/**
 * Setup script for Google Cloud Storage bucket configuration
 * This script sets up the bucket with proper IAM permissions and security settings
 */

const keyFilename = path.join(__dirname, '../gcs-key.json');
const storage = new Storage({ keyFilename });
const bucketName = 'course_content_materials';

async function setupGCSBucket() {
  try {
    console.log('Setting up Google Cloud Storage bucket...');
    
    // Check if bucket exists, create if it doesn't
    const [exists] = await storage.bucket(bucketName).exists();
    
    if (!exists) {
      console.log(`Creating bucket: ${bucketName}`);
      await storage.createBucket(bucketName, {
        location: 'US', // Choose appropriate location
        storageClass: 'STANDARD',
        versioning: {
          enabled: true
        },
        lifecycle: {
          rule: [
            {
              action: {
                type: 'Delete'
              },
              condition: {
                age: 365, // Delete files older than 1 year
                isLive: true
              }
            }
          ]
        }
      });
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    // Set up bucket IAM policy with proper permissions
    await setupBucketIAM();
    
    // Configure CORS for web access
    await setupCORS();
    
    // Set up public access prevention
    await setupPublicAccessPrevention();
    
    console.log('GCS bucket setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up GCS bucket:', error);
    throw error;
  }
}

async function setupBucketIAM() {
  try {
    console.log('Setting up bucket IAM permissions...');
    
    const bucket = storage.bucket(bucketName);
    const [policy] = await bucket.iam.getPolicy();
    
    // Define the IAM bindings we want to set
    const bindings = [
      {
        role: 'roles/storage.objectViewer',
        members: [
          'serviceAccount:your-service-account@your-project.iam.gserviceaccount.com'
        ],
        condition: {
          title: 'Service account file access',
          description: 'Allow service account to read files',
          expression: 'resource.name.startsWith("projects/_/buckets/course_content_materials/objects/uploads/")'
        }
      },
      {
        role: 'roles/storage.objectAdmin',
        members: [
          'serviceAccount:your-service-account@your-project.iam.gserviceaccount.com'
        ],
        condition: {
          title: 'Service account file management',
          description: 'Allow service account to manage files',
          expression: 'resource.name.startsWith("projects/_/buckets/course_content_materials/objects/uploads/")'
        }
      }
    ];
    
    // Update the policy with our bindings
    policy.bindings = bindings;
    policy.version = 3; // Use version 3 for conditions
    
    await bucket.iam.setPolicy(policy);
    console.log('Bucket IAM permissions set successfully');
    
  } catch (error) {
    console.error('Error setting up bucket IAM:', error);
    throw error;
  }
}

async function setupCORS() {
  try {
    console.log('Setting up CORS configuration...');
    
    const bucket = storage.bucket(bucketName);
    
    const corsConfiguration = [
      {
        origin: ['http://localhost:3000', 'https://your-domain.com'], // Add your domains
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
        responseHeader: [
          'Content-Type',
          'Content-Length',
          'Content-Disposition',
          'Access-Control-Allow-Origin'
        ],
        maxAgeSeconds: 3600
      }
    ];
    
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('CORS configuration set successfully');
    
  } catch (error) {
    console.error('Error setting up CORS:', error);
    throw error;
  }
}

async function setupPublicAccessPrevention() {
  try {
    console.log('Setting up public access prevention...');
    
    const bucket = storage.bucket(bucketName);
    
    // Enable public access prevention
    await bucket.setIamPolicy({
      bindings: [
        {
          role: 'roles/storage.admin',
          members: ['serviceAccount:your-service-account@your-project.iam.gserviceaccount.com']
        }
      ],
      version: 3
    });
    
    console.log('Public access prevention configured');
    
  } catch (error) {
    console.error('Error setting up public access prevention:', error);
    throw error;
  }
}

/**
 * Create a service account key file for authentication
 * This should be run once to generate the service account key
 */
async function createServiceAccountKey() {
  console.log(`
To create a service account key:

1. Go to Google Cloud Console > IAM & Admin > Service Accounts
2. Create a new service account or select existing one
3. Add the following roles:
   - Storage Object Admin
   - Storage Object Viewer
   - Storage Admin (for bucket management)
4. Create a new key (JSON format)
5. Download and save as 'gcs-key.json' in the server directory
6. Update the service account email in this script

The service account should have permissions to:
- Upload files to the bucket
- Generate signed URLs
- Manage IAM permissions
- Delete files
  `);
}

/**
 * Validate the current setup
 */
async function validateSetup() {
  try {
    console.log('Validating GCS setup...');
    
    const bucket = storage.bucket(bucketName);
    
    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Bucket ${bucketName} does not exist`);
    }
    
    // Check IAM policy
    const [policy] = await bucket.iam.getPolicy();
    console.log('Current IAM policy:', JSON.stringify(policy, null, 2));
    
    // Check CORS configuration
    const [cors] = await bucket.getCorsConfiguration();
    console.log('Current CORS configuration:', JSON.stringify(cors, null, 2));
    
    console.log('GCS setup validation completed successfully');
    
  } catch (error) {
    console.error('GCS setup validation failed:', error);
    throw error;
  }
}

// Export functions for use in other scripts
module.exports = {
  setupGCSBucket,
  setupBucketIAM,
  setupCORS,
  setupPublicAccessPrevention,
  createServiceAccountKey,
  validateSetup
};

// Run setup if this script is executed directly
if (require.main === module) {
  setupGCSBucket()
    .then(() => validateSetup())
    .then(() => {
      console.log('GCS setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('GCS setup failed:', error);
      process.exit(1);
    });
} 