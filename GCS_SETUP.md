# Google Cloud Storage Setup Guide for EduFlow

This guide will help you set up Google Cloud Storage (GCS) with proper IAM permissions for secure file uploads and downloads in the EduFlow application.

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud project with billing enabled
3. Google Cloud CLI installed (optional but recommended)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project
4. Note down your Project ID

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

```bash
# Using gcloud CLI
gcloud services enable storage.googleapis.com
gcloud services enable iam.googleapis.com
```

Or enable them manually in the Google Cloud Console:
- Cloud Storage API
- Identity and Access Management (IAM) API

## Step 3: Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name: `eduflow-storage-service`
4. Description: `Service account for EduFlow file storage`
5. Click **Create and Continue**

### Assign Required Roles

Add the following roles to the service account:

- **Storage Object Admin** (`roles/storage.objectAdmin`)
- **Storage Object Viewer** (`roles/storage.objectViewer`)
- **Storage Admin** (`roles/storage.admin`) - for bucket management

### Create Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the key file
6. Rename it to `gcs-key.json`
7. Place it in the `server/` directory of your EduFlow project

**⚠️ Security Note:** Never commit the service account key to version control. Add `gcs-key.json` to your `.gitignore` file.

## Step 4: Create GCS Bucket

### Option A: Using the Setup Script

1. Update the service account email in `server/utils/setupGCS.js`
2. Run the setup script:

```bash
cd server
node utils/setupGCS.js
```

### Option B: Manual Setup

1. Go to **Cloud Storage** > **Buckets**
2. Click **Create Bucket**
3. Configure the bucket:
   - **Name**: `course_content_materials` (or your preferred name)
   - **Location**: Choose a location close to your users
   - **Storage Class**: Standard
   - **Access Control**: Uniform
   - **Protection Tools**: Enable versioning

## Step 5: Configure Bucket IAM Permissions

The setup script will configure IAM permissions automatically. If you need to do it manually:

### Set IAM Policy

```javascript
// Using the Google Cloud Console or gcloud CLI
gcloud storage buckets add-iam-policy-binding gs://course_content_materials \
    --member="serviceAccount:your-service-account@your-project.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Configure CORS

Set up CORS to allow web access:

```json
[
  {
    "origin": ["http://localhost:3000", "https://your-domain.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": [
      "Content-Type",
      "Content-Length", 
      "Content-Disposition",
      "Access-Control-Allow-Origin"
    ],
    "maxAgeSeconds": 3600
  }
]
```

## Step 6: Update Application Configuration

### Update Environment Variables

Add the following to your `.env` file:

```env
# Google Cloud Storage Configuration
GCS_BUCKET_NAME=course_content_materials
GCS_PROJECT_ID=your-project-id
GCS_KEY_FILE=./gcs-key.json
```

### Update Service Account Email

In `server/utils/setupGCS.js`, replace:
```javascript
'serviceAccount:your-service-account@your-project.iam.gserviceaccount.com'
```

With your actual service account email:
```javascript
'serviceAccount:eduflow-storage-service@your-project-id.iam.gserviceaccount.com'
```

## Step 7: Test the Setup

### Run the Setup Validation

```bash
cd server
node utils/setupGCS.js
```

### Test File Upload

1. Start your EduFlow server
2. Try uploading a file through the application
3. Check the GCS bucket to verify the file was uploaded
4. Test downloading the file

## Security Best Practices

### 1. Service Account Security

- Use the principle of least privilege
- Rotate service account keys regularly
- Use Workload Identity Federation for production (recommended)

### 2. Bucket Security

- Enable public access prevention
- Use uniform bucket-level access
- Enable versioning for data protection
- Set up lifecycle policies to manage costs

### 3. File Access Control

- Files are stored privately by default
- Access is controlled through signed URLs
- IAM conditions restrict access to user-specific folders
- Files are organized by user and course ID

### 4. Environment Security

- Store service account keys securely
- Use environment variables for configuration
- Never expose credentials in client-side code

## File Organization Structure

Files are organized in GCS as follows:

```
gs://course_content_materials/
├── uploads/
│   ├── {userId}/
│   │   ├── {courseId}/
│   │   │   ├── {timestamp}-{filename}
│   │   │   └── ...
│   │   └── ...
│   └── ...
```

## API Endpoints

The following endpoints are available for file management:

- `POST /api/materials/upload` - Upload a file
- `GET /api/materials` - List accessible files
- `GET /api/materials/download/:id` - Get download URL
- `PUT /api/materials/:id` - Update file metadata
- `DELETE /api/materials/:id` - Delete a file
- `GET /api/materials/stats` - Get file statistics

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Verify service account key is correct
   - Check if the key file path is correct
   - Ensure the service account has proper permissions

2. **Bucket Not Found**
   - Verify bucket name is correct
   - Check if bucket exists in the specified project
   - Ensure the service account has access to the bucket

3. **CORS Errors**
   - Verify CORS configuration includes your domain
   - Check if the bucket CORS settings are applied
   - Ensure the request includes proper headers

4. **Permission Denied**
   - Check IAM permissions for the service account
   - Verify the bucket IAM policy is set correctly
   - Ensure the service account has the required roles

### Debug Commands

```bash
# Check bucket exists
gsutil ls gs://course_content_materials

# Check bucket IAM policy
gsutil iam get gs://course_content_materials

# Check CORS configuration
gsutil cors get gs://course_content_materials

# Test file upload
gsutil cp test-file.txt gs://course_content_materials/uploads/test/
```

## Cost Optimization

1. **Storage Classes**: Use appropriate storage classes for different file types
2. **Lifecycle Policies**: Automatically delete old files
3. **Object Versioning**: Disable if not needed
4. **Monitoring**: Set up alerts for storage costs

## Production Deployment

For production deployment:

1. Use Workload Identity Federation instead of service account keys
2. Set up proper monitoring and alerting
3. Configure backup and disaster recovery
4. Use regional buckets for better performance
5. Implement proper logging and audit trails

## References

- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [IAM Permissions Guide](https://cloud.google.com/storage/docs/access-control/using-iam-permissions)
- [Signed URLs Documentation](https://cloud.google.com/storage/docs/access-control/signed-urls)
- [CORS Configuration](https://cloud.google.com/storage/docs/cross-origin) 