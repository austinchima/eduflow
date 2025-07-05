const mongoose = require('mongoose');
const User = require('../models/User');

const generateUniqueUsername = async (firstName, lastName, excludeUserId = null) => {
  const baseUsername = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  let username = baseUsername;
  let counter = 1;
  
  // Keep trying until we find a unique username
  while (true) {
    const query = { username };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }
    const existingUser = await User.findOne(query);
    if (!existingUser) {
      break;
    }
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
};

const migrateGeneratedUsernames = async () => {
  try {
    console.log('Starting migration: Adding generatedUsername field to existing users...');
    
    // Find all users without generatedUsername field
    const usersToUpdate = await User.find({ generatedUsername: { $exists: false } });
    
    console.log(`Found ${usersToUpdate.length} users to update`);
    
    for (const user of usersToUpdate) {
      const generatedUsername = await generateUniqueUsername(
        user.firstName || 'user', 
        user.lastName || 'user', 
        user._id
      );
      
      // Update the user with generatedUsername
      await User.findByIdAndUpdate(user._id, {
        generatedUsername: generatedUsername
      });
      
      console.log(`Updated user ${user.email} with generatedUsername: ${generatedUsername}`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduflow';
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return migrateGeneratedUsernames();
    })
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateGeneratedUsernames }; 