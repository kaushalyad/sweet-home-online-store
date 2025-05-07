import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const resetAdminPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet-home-store');
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await userModel.findOne({ 
            email: 'sweethomeonlinestorehelp@gmail.com' 
        }).select('+password');

        if (!adminUser) {
            console.log('Admin user not found');
            return;
        }

        console.log('Current admin user:', {
            email: adminUser.email,
            role: adminUser.role,
            id: adminUser._id,
            hasPassword: !!adminUser.password,
            currentPasswordHash: adminUser.password
        });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Kaushalyad@123', salt);

        // Update password
        adminUser.password = hashedPassword;
        await adminUser.save();

        console.log('Admin password reset successful');
        console.log('Updated admin details:', {
            email: adminUser.email,
            role: adminUser.role,
            id: adminUser._id,
            newPasswordHash: hashedPassword
        });

        // Test password comparison
        const testPassword = 'Kaushalyad@123';
        const isMatch = await bcrypt.compare(testPassword, hashedPassword);
        console.log('Password verification test:', {
            testPassword,
            isMatch,
            passwordLength: testPassword.length,
            hashedPasswordLength: hashedPassword.length
        });

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdminPassword(); 