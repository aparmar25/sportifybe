require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportify';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createSuperAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('=================================');
    console.log('   CREATE SUPER ADMIN ACCOUNT');
    console.log('=================================\n');

    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    const confirmPassword = await question('Confirm password: ');

    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      console.log('\n⚠️  Username or email already exists!');
      const overwrite = await question('Delete and recreate? (yes/no): ');
      
      if (overwrite.toLowerCase() === 'yes') {
        await Admin.deleteOne({ _id: existingAdmin._id });
        console.log('✅ Existing admin deleted');
      } else {
        console.log('❌ Operation cancelled');
        process.exit(0);
      }
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: 'super_admin'
    });

    await admin.save();

    console.log('\n=================================');
    console.log('✅ SUPER ADMIN CREATED!');
    console.log('=================================');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Role: super_admin`);
    console.log('=================================');
    console.log('\n⚠️  IMPORTANT: Keep these credentials safe!');
    console.log('This super admin can create/delete other admins.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();