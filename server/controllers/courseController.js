const Course = require('../models/Course');
const Material = require('../models/Material');
const { deleteFileFromGCS, deleteCourseFolderFromGCS } = require('../utils/gcsUpload');

// Get all courses for a user
exports.getUserCourses = async (req, res) => {
  try {
    // Get userId from authenticated user (req.user is set by auth middleware)
    const userId = req.user.id;
    const courses = await Course.find({ userId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get userId from authenticated user (req.user is set by auth middleware)
    const courseData = {
      ...req.body,
      userId: req.user.id // Use the authenticated user's ID
    };
    
    const course = new Course(courseData);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', error: err.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updated = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    // Find the course to ensure it exists and belongs to the user
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify the course belongs to the authenticated user
    if (course.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Course does not belong to user' });
    }
    
    // Delete the entire course folder from GCS
    let gcsDeletionResult = { deletedCount: 0, message: 'No files found' };
    try {
      gcsDeletionResult = await deleteCourseFolderFromGCS(userId, courseId);
      console.log('GCS deletion result:', gcsDeletionResult);
    } catch (gcsError) {
      console.error('Failed to delete course folder from GCS:', gcsError.message);
      // Continue with database deletion even if GCS deletion fails
    }
    
    // Delete all material documents for this course from database
    const materialDeletionResult = await Material.deleteMany({ courseId });
    console.log(`Deleted ${materialDeletionResult.deletedCount} material documents from database`);
    
    // Delete the course itself
    const deleted = await Course.findByIdAndDelete(courseId);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found during deletion' });
    }
    
    res.json({ 
      message: `Course deleted successfully`,
      details: {
        courseDeleted: true,
        materialsDeleted: materialDeletionResult.deletedCount,
        gcsFilesDeleted: gcsDeletionResult.deletedCount,
        gcsMessage: gcsDeletionResult.message
      }
    });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Failed to delete course and materials', error: err.message });
  }
}; 