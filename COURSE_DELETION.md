# Course Deletion Functionality

## Overview

The course deletion feature has been enhanced to provide comprehensive cleanup when a user deletes a course. This includes:

- **Database cleanup**: Removes course and all associated materials from the database
- **GCS cleanup**: Deletes all uploaded files and the entire course folder from Google Cloud Storage
- **User feedback**: Provides detailed confirmation dialogs and success/error messages
- **Security**: Ensures only course owners can delete their courses

## How It Works

### 1. Frontend Confirmation

When a user attempts to delete a course, they are presented with a detailed confirmation dialog that explains:

- The course and all its data will be permanently deleted
- All uploaded materials and files will be removed
- Generated course content and AI materials will be deleted
- Study progress and analytics data will be lost
- The action cannot be undone

### 2. Backend Processing

The deletion process follows these steps:

1. **Authentication & Authorization**: Verifies the user is authenticated and owns the course
2. **GCS Folder Deletion**: Deletes the entire course folder from Google Cloud Storage
3. **Database Cleanup**: Removes all material documents and the course document
4. **Response**: Returns detailed information about what was deleted

### 3. File Structure

Files are organized in GCS as follows:
```
gs://course_content_materials/
├── uploads/
│   ├── {userId}/
│   │   ├── {courseId}/
│   │   │   ├── {timestamp}-{filename1}
│   │   │   ├── {timestamp}-{filename2}
│   │   │   └── ...
│   │   └── ...
│   └── ...
```

When a course is deleted, the entire `uploads/{userId}/{courseId}/` folder is removed.

## Implementation Details

### Backend Changes

#### 1. Enhanced GCS Utility (`server/utils/gcsUpload.js`)

Added `deleteCourseFolderFromGCS` function:

```javascript
async function deleteCourseFolderFromGCS(userId, courseId) {
  const bucket = storage.bucket(bucketName);
  const courseFolderPrefix = `uploads/${userId}/${courseId}/`;
  
  // List all files in the course folder
  const [files] = await bucket.getFiles({ prefix: courseFolderPrefix });
  
  // Delete all files in the folder
  const deletePromises = files.map(file => file.delete());
  await Promise.all(deletePromises);
  
  return { 
    deletedCount: files.length, 
    message: `Successfully deleted ${files.length} files from course folder` 
  };
}
```

#### 2. Enhanced Course Controller (`server/controllers/courseController.js`)

Updated `deleteCourse` function:

```javascript
exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  
  // Verify course exists and belongs to user
  const course = await Course.findById(courseId);
  if (!course || course.userId.toString() !== userId.toString()) {
    return res.status(404).json({ message: 'Course not found or access denied' });
  }
  
  // Delete entire course folder from GCS
  let gcsDeletionResult = { deletedCount: 0, message: 'No files found' };
  try {
    gcsDeletionResult = await deleteCourseFolderFromGCS(userId, courseId);
  } catch (gcsError) {
    console.error('Failed to delete course folder from GCS:', gcsError.message);
  }
  
  // Delete materials and course from database
  const materialDeletionResult = await Material.deleteMany({ courseId });
  const deleted = await Course.findByIdAndDelete(courseId);
  
  res.json({ 
    message: `Course deleted successfully`,
    details: {
      courseDeleted: true,
      materialsDeleted: materialDeletionResult.deletedCount,
      gcsFilesDeleted: gcsDeletionResult.deletedCount,
      gcsMessage: gcsDeletionResult.message
    }
  });
};
```

### Frontend Changes

#### 1. Enhanced Confirmation Dialog (`src/pages/course-management/index.jsx`)

Updated delete confirmation modal with detailed information:

```jsx
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200 p-4">
    <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
      <div className="flex items-center mb-4">
        <Icon name="AlertTriangle" size={24} className="text-error mr-3" />
        <h2 className="text-lg font-semibold text-text-primary">Confirm Course Deletion</h2>
      </div>
      <div className="mb-6">
        <p className="text-text-secondary mb-3">
          Are you sure you want to delete this course? This action will permanently remove:
        </p>
        <ul className="text-sm text-text-secondary space-y-1 mb-4">
          <li>• The course and all its data</li>
          <li>• All uploaded materials and files</li>
          <li>• Generated course content and AI materials</li>
          <li>• Study progress and analytics data</li>
        </ul>
        <p className="text-xs text-text-muted font-medium">
          ⚠️ This action cannot be undone. All data will be permanently deleted from both the database and cloud storage.
        </p>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={cancelDeleteCourse}>Cancel</Button>
        <Button variant="error" onClick={confirmDeleteCourse}>Delete Course</Button>
      </div>
    </div>
  </div>
)}
```

#### 2. Enhanced User Context (`src/context/UserContext.jsx`)

Updated `removeCourse` function with better error handling:

```javascript
const removeCourse = async (courseId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete course from database');
    }
    
    const result = await response.json();
    dispatch({ type: ACTIONS.REMOVE_COURSE, payload: courseId });
    
    return result;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};
```

## API Response Format

### Success Response

```json
{
  "message": "Course deleted successfully",
  "details": {
    "courseDeleted": true,
    "materialsDeleted": 5,
    "gcsFilesDeleted": 5,
    "gcsMessage": "Successfully deleted 5 files from course folder"
  }
}
```

### Error Response

```json
{
  "message": "Failed to delete course and materials",
  "error": "Detailed error message"
}
```

## Testing

### Manual Testing

1. **Create a course** with uploaded materials
2. **Delete the course** using the delete button
3. **Verify** that:
   - Course is removed from the UI
   - Materials are no longer accessible
   - GCS folder is deleted (check Google Cloud Console)
   - Database records are removed

### Automated Testing

Run the test script:

```bash
cd server
node test-course-deletion.js
```

This will test the GCS deletion functionality with a test course folder.

## Security Considerations

### 1. Authentication & Authorization

- All deletion requests require valid authentication
- Users can only delete their own courses
- Server-side validation ensures course ownership

### 2. GCS Permissions

- Service account requires `storage.objectAdmin` permissions
- Files are stored privately and accessed via signed URLs
- Course folders are isolated by user ID

### 3. Error Handling

- GCS deletion failures don't prevent database cleanup
- Detailed error messages help with debugging
- Frontend gracefully handles backend errors

## Troubleshooting

### Common Issues

1. **GCS Permission Errors**
   - Verify service account key file exists
   - Check service account has proper permissions
   - Ensure bucket exists and is accessible

2. **Course Not Found**
   - Verify course ID is correct
   - Check if course belongs to authenticated user
   - Ensure course exists in database

3. **Partial Deletion**
   - Check server logs for GCS errors
   - Verify network connectivity to GCS
   - Check bucket permissions

### Debug Commands

```bash
# Test GCS connection
cd server
node test-gcs-config.js

# Test course deletion
node test-course-deletion.js

# Check server logs
tail -f server.log
```

## Performance Considerations

### 1. Batch Operations

- GCS file deletion uses `Promise.all()` for parallel processing
- Database operations are optimized with bulk operations

### 2. Error Recovery

- GCS deletion failures don't block database cleanup
- Partial failures are logged for debugging

### 3. User Experience

- Detailed confirmation dialogs prevent accidental deletions
- Progress indicators show deletion status
- Success/error messages provide clear feedback

## Future Enhancements

### Potential Improvements

1. **Soft Delete**: Add option to archive courses instead of permanent deletion
2. **Bulk Operations**: Allow deletion of multiple courses at once
3. **Recovery**: Add ability to restore recently deleted courses
4. **Analytics**: Track deletion patterns and storage cleanup metrics
5. **Notifications**: Send email confirmations for course deletions

### Monitoring

- Add metrics for deletion success/failure rates
- Monitor GCS storage usage before/after deletions
- Track user deletion patterns for UX improvements 