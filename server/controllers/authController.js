const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Check if JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set!');
  process.exit(1);
}

// Function to generate a unique username
const generateUniqueUsername = async (firstName, lastName) => {
  console.log('generateUniqueUsername called with:', { firstName, lastName });
  
  // Handle empty or undefined names
  const safeFirstName = (firstName || 'user').trim();
  const safeLastName = (lastName || 'user').trim();
  
  console.log('Safe names:', { safeFirstName, safeLastName });
  
  // If both are empty, use a default
  if (!safeFirstName && !safeLastName) {
    console.log('Both names are empty, using fallback');
    return 'user' + Date.now();
  }
  
  const baseUsername = `${safeFirstName}${safeLastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  console.log('baseUsername:', baseUsername);
  
  // Ensure we have a valid base username
  if (!baseUsername || baseUsername.trim() === '') {
    console.log('Base username is empty, using fallback');
    return 'user' + Date.now();
  }
  
  // For now, just add a timestamp to ensure uniqueness
  // We can add database checking later once the basic flow works
  const username = baseUsername + Date.now();
  
  console.log('Generated username:', username);
  return username;
};

// Function to check if username is available
const isUsernameAvailable = async (username, excludeUserId = null) => {
  const query = { username };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  const existingUser = await User.findOne(query);
  return !existingUser;
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log('Registration request body:', { email, firstName, lastName });
    
    // Check for existing user by email
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists' });
    
    // Generate unique username
    const generatedUsername = await generateUniqueUsername(firstName || 'user', lastName || 'user');
    console.log('Generated username for registration:', generatedUsername);
    
    // Validate that we have a username
    if (!generatedUsername || generatedUsername.trim() === '') {
      throw new Error('Failed to generate username');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { 
      username: generatedUsername, // Use generated username as initial username
      generatedUsername, // Store the generated username
      email, 
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      hasCompletedSetup: false // New users haven't completed setup
    };
    console.log('User data to save:', { ...userData, password: '[HIDDEN]' });
    
    user = new User(userData);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        generatedUsername: user.generatedUsername,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasCompletedSetup: user.hasCompletedSetup
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        generatedUsername: user.generatedUsername,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasCompletedSetup: user.hasCompletedSetup
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// New endpoint to check username availability
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const isAvailable = await isUsernameAvailable(username, req.user.id);
    res.json({ available: isAvailable });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, firstName, lastName, email, username, studyGoal, targetGpa, notifications, theme, hasCompletedSetup } = req.body;
    
    // Only allow users to update their own profile
    if (req.params.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (studyGoal !== undefined) updateData.studyGoal = studyGoal;
    if (targetGpa !== undefined) updateData.targetGpa = targetGpa;
    if (notifications !== undefined) updateData.notifications = notifications;
    if (theme !== undefined) updateData.theme = theme;
    if (hasCompletedSetup !== undefined) updateData.hasCompletedSetup = hasCompletedSetup;

    // Handle username update with validation
    if (username !== undefined) {
      const isAvailable = await isUsernameAvailable(username, req.user.id);
      if (!isAvailable) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updateData.username = username;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
