const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Get all courses for the authenticated user (must come before parameterized routes)
router.get('/user', auth, courseController.getUserCourses);
// Create a new course
router.post('/', auth, courseController.createCourse);
// Add or replace modules for a course
router.post('/:courseId/modules', auth, courseController.addModulesToCourse);
// Get modules for a course
router.get('/:courseId/modules', auth, courseController.getCourseModules);
// Update a course
router.put('/:courseId', auth, courseController.updateCourse);
// Delete a course
router.delete('/:courseId', auth, courseController.deleteCourse);

module.exports = router; 