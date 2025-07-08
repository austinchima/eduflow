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

// Add or replace modules for a course
exports.addModulesToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { modules } = req.body;
    
    console.log('=== MODULE SAVE ATTEMPT ===');
    console.log('Course ID:', courseId);
    console.log('User ID:', userId);
    console.log('Received modules data:', JSON.stringify(modules, null, 2));
    
    // Validate courseId format
    if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid course ID format:', courseId);
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    
    // Validate input
    if (!modules) {
      console.error('No modules data provided');
      return res.status(400).json({ message: 'Modules data is required' });
    }
    if (!Array.isArray(modules)) {
      console.error('Modules is not an array:', typeof modules);
      return res.status(400).json({ message: 'Modules must be an array' });
    }
    
    console.log('Looking for course with ID:', courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found with ID:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }
    
    console.log('Found course:', course.name);
    console.log('Course userId:', course.userId.toString());
    console.log('Request userId:', userId.toString());
    
    if (course.userId.toString() !== userId.toString()) {
      console.error('Access denied: Course belongs to different user');
      return res.status(403).json({ message: 'Access denied: Course does not belong to user' });
    }
    
    // Normalize the modules structure to match the Course schema
    console.log('Normalizing modules...');
    const normalizedModules = modules.map((module, moduleIndex) => {
      if (!module || typeof module !== 'object') {
        console.warn(`Invalid module at index ${moduleIndex}:`, module);
        return {
          title: 'Untitled Module',
          lessons: []
        };
      }
      
      return {
        title: typeof module.title === 'object' 
          ? (module.title.text || module.title.name || JSON.stringify(module.title))
          : (module.title || 'Untitled Module'),
        lessons: Array.isArray(module.lessons) 
          ? module.lessons.map((lesson, lessonIndex) => {
              if (!lesson || typeof lesson !== 'object') {
                console.warn(`Invalid lesson at index ${lessonIndex} in module ${moduleIndex}:`, lesson);
                return {
                  title: 'Untitled Lesson',
                  summary: '',
                  keyPoints: [],
                  example: '',
                  task: ''
                };
              }
              
              return {
                title: typeof lesson.title === 'object'
                  ? (lesson.title.text || lesson.title.name || JSON.stringify(lesson.title))
                  : (lesson.title || 'Untitled Lesson'),
                summary: typeof lesson.summary === 'object'
                  ? (lesson.summary.description || lesson.summary.title || JSON.stringify(lesson.summary))
                  : (lesson.summary || ''),
                keyPoints: Array.isArray(lesson.keyPoints) 
                  ? lesson.keyPoints.map(point => 
                      typeof point === 'object' && point.point 
                        ? point.point 
                        : (typeof point === 'string' ? point : JSON.stringify(point))
                    )
                  : [],
                example: typeof lesson.example === 'object'
                  ? (lesson.example.description || lesson.example.title || JSON.stringify(lesson.example))
                  : (lesson.example || ''),
                task: typeof lesson.task === 'object'
                  ? (lesson.task.question || lesson.task.explanation || JSON.stringify(lesson.task))
                  : (lesson.task || '')
              };
            })
          : []
      };
    });
    
    console.log('Normalized modules:', JSON.stringify(normalizedModules, null, 2));
    
    // Validate the normalized structure
    const validationErrors = [];
    normalizedModules.forEach((module, moduleIndex) => {
      if (!module.title || typeof module.title !== 'string') {
        validationErrors.push(`Module ${moduleIndex}: Invalid title`);
      }
      if (!Array.isArray(module.lessons)) {
        validationErrors.push(`Module ${moduleIndex}: Lessons must be an array`);
      } else {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.title || typeof lesson.title !== 'string') {
            validationErrors.push(`Module ${moduleIndex}, Lesson ${lessonIndex}: Invalid title`);
          }
          if (!Array.isArray(lesson.keyPoints)) {
            validationErrors.push(`Module ${moduleIndex}, Lesson ${lessonIndex}: KeyPoints must be an array`);
          }
        });
      }
    });
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({ message: 'Invalid module structure', errors: validationErrors });
    }
    
    console.log('Saving modules to course...');
    course.modules = normalizedModules;
    await course.save();
    console.log('Modules saved successfully!');
    
    res.json({ message: 'Modules updated', modules: course.modules });
  } catch (err) {
    console.error('=== ERROR SAVING MODULES ===');
    console.error('Error type:', err.constructor.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    // Check for specific MongoDB errors
    if (err.name === 'ValidationError') {
      console.error('MongoDB validation errors:', err.errors);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    
    if (err.name === 'CastError') {
      console.error('MongoDB cast error:', err.message);
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    res.status(500).json({ message: 'Failed to update modules', error: err.message });
  }
};

// Get modules for a course
exports.getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Course does not belong to user' });
    }
    res.json({ modules: course.modules || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch modules', error: err.message });
  }
}; 