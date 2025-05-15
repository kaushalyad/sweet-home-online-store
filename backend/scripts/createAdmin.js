import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/mongodb.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const adminData = {
      name: 'Admin User',
      email: 'sweethomeonlinestorehelp@gmail.com',
      password: 'Kaushalyad@123',
      role: 'super_admin'
    };

    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new Admin(adminData);
    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 
createAdmin(); 