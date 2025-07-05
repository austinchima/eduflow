const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Get current user
router.get('/me', auth, authController.getUser);
// Check username availability
router.get('/check-username/:username', auth, authController.checkUsername);
// Update user profile
router.put('/users/:userId', auth, authController.updateUser);

module.exports = router;
