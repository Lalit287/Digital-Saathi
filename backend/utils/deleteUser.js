const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const deleteUser = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.error('Usage: node utils/deleteUser.js <email>');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-saathi');
    console.log('Connected to MongoDB\n');

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.error(`User with email "${normalizedEmail}" not found.`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Deleting...`);
    
    await User.deleteOne({ email: normalizedEmail });
    
    console.log(`✅ User deleted successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

deleteUser();

