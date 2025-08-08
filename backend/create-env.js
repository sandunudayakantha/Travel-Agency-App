const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Replace the MONGODB_URI below with your MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/travel-agency?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/travel-agency?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway Configuration (optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('Please edit the existing .env file with your MongoDB Atlas connection string.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Get your MongoDB Atlas connection string');
  console.log('2. Edit the .env file and replace the MONGODB_URI');
  console.log('3. Run: npm run setup');
  console.log('4. Run: npm run dev');
}

console.log('');
console.log('🔗 MongoDB Atlas Setup Guide:');
console.log('1. Go to: https://www.mongodb.com/atlas');
console.log('2. Create a free account');
console.log('3. Create a new cluster (FREE tier)');
console.log('4. Click "Connect" and choose "Connect your application"');
console.log('5. Copy the connection string');
console.log('6. Replace "your-username" and "your-password" with your actual credentials');
console.log('7. Add "/travel-agency" to the end of the URI (before the ?)'); 