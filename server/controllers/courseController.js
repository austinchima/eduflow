const Course = require('../models/Course');

// Get all courses for a user
exports.getUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await Course.find({ userId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
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
    const deleted = await Course.findByIdAndDelete(courseId);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
}; 