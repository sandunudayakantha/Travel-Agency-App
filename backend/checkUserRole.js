const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAndUpdateUserRoles() {
  try {
    console.log('Checking user roles...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`- ${user.email}: role = ${user.role}`);
    });
    
    // Check if there are any admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\nAdmin users: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('\nNo admin users found. Creating admin user...');
      
      // Create an admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@wanderlust.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    }
    
    // Update existing users to admin if needed
    const testEmails = ['admin@wanderlust.com', 'admin@example.com', 'test@example.com'];
    
    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user && user.role !== 'admin') {
        console.log(`Updating ${email} to admin role...`);
        user.role = 'admin';
        await user.save();
        console.log(`Updated ${email} to admin role`);
      }
    }
    
    console.log('\nFinal user roles:');
    const finalUsers = await User.find({});
    finalUsers.forEach(user => {
      console.log(`- ${user.email}: role = ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAndUpdateUserRoles();
