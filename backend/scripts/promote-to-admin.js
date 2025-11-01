const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const promoteUserToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    console.log('User promoted to admin:', user.email);
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Usage: node promote-to-admin.js <email>');
  process.exit(1);
}

promoteUserToAdmin(email);