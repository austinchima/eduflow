const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');
const auth = require('../middleware/auth');

// Log a new study session
router.post('/', auth, studySessionController.logSession);

// Get all study sessions for the authenticated user (optionally by course/date)
router.get('/', auth, studySessionController.getSessions);

// Delete a study session
router.delete('/:sessionId', auth, studySessionController.deleteSession);

module.exports = router; 