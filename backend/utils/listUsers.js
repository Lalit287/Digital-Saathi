const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-saathi');
    console.log('Connected to MongoDB\n');

    const users = await User.find().select('email name role createdAt');
    
    console.log(`Found ${users.length} users:\n`);
    console.log('Email'.padEnd(30), 'Name'.padEnd(20), 'Role'.padEnd(10), 'Created');
    console.log('-'.repeat(80));
    
    users.forEach(user => {
      console.log(
        user.email.padEnd(30),
        (user.name || '').padEnd(20),
        user.role.padEnd(10),
        user.createdAt.toLocaleDateString()
      );
    });
    
    console.log('\nTo delete a user, use:');
    console.log('  node utils/deleteUser.js <email>');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

listUsers();

