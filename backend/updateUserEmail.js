import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import connectDB from './config/mongodb.js';
import userModel from './models/userModel.js';

async function updateUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const result = await userModel.updateOne(
      { phone: '8797196867' },
      {
        $set: {
          email: 'test@example.com',
          isEmailVerified: false
        }
      }
    );

    console.log('Update result:', result);

    const user = await userModel.findOne({ phone: '8797196867' });
    console.log('Updated user:', { email: user.email, phone: user.phone });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUser();