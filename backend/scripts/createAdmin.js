import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet-home-store');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: 'sweethomeonlinestorehelp@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        email: existingAdmin.email,
        role: existingAdmin.role,
        id: existingAdmin._id
      });
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Kaushalyad@123', salt);

    const admin = await userModel.create({
      name: 'Admin User',
      email: 'sweethomeonlinestorehelp@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    console.log('Admin user created successfully:', {
      email: admin.email,
      role: admin.role,
      id: admin._id
    });
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin(); 