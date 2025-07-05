const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Get all courses for the authenticated user
router.get('/users/courses', auth, courseController.getUserCourses);
// Create a new course
router.post('/courses', auth, courseController.createCourse);
// Update a course
router.put('/courses/:courseId', auth, courseController.updateCourse);
// Delete a course
router.delete('/courses/:courseId', auth, courseController.deleteCourse);

module.exports = router; 