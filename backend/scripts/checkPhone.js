import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/mongodb.js';
import userModel from '../models/userModel.js';

dotenv.config();

const checkPhones = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    // Check for specific phone numbers
    const phones = ['8797196867', '9931018857'];
    
    for (const phone of phones) {
      const user = await userModel.findOne({ phone });
      if (user) {
        console.log(`Found user with phone ${phone}:`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Phone: ${user.phone}`);
        console.log(`  Created: ${user.createdAt}\n`);
      } else {
        console.log(`No user found with phone ${phone}\n`);
      }
    }

    // Show all users with their phones
    console.log('All users in database:');
    const allUsers = await userModel.find({}, { name: 1, email: 1, phone: 1, createdAt: 1 });
    allUsers.forEach(user => {
      console.log(`  ${user.name} | ${user.email} | ${user.phone}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkPhones();
