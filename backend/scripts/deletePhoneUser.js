import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/mongodb.js';
import userModel from '../models/userModel.js';

dotenv.config();

const deleteUser = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    // Delete user with only phone number
    const result = await userModel.deleteOne({ phone: '9931018857', email: null });
    
    if (result.deletedCount > 0) {
      console.log('✓ Successfully deleted incomplete user with phone 9931018857');
    } else {
      console.log('No user found to delete');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

deleteUser();
