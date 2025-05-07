import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const verifyAdminPassword = async () => {
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

        console.log('Admin user found:', {
            email: adminUser.email,
            role: adminUser.role,
            id: adminUser._id,
            hasPassword: !!adminUser.password,
            passwordHash: adminUser.password
        });

        // Test password
        const testPassword = 'Kaushalyad@123';
        const isMatch = await bcrypt.compare(testPassword, adminUser.password);
        
        console.log('Password verification:', {
            testPassword,
            isMatch,
            passwordLength: testPassword.length,
            hashedPasswordLength: adminUser.password.length
        });

        if (!isMatch) {
            // Reset password if it doesn't match
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(testPassword, salt);
            
            adminUser.password = newHash;
            await adminUser.save();
            
            console.log('Password has been reset to:', testPassword);
            console.log('New hash:', newHash);
            
            // Verify new password
            const verifyNew = await bcrypt.compare(testPassword, newHash);
            console.log('New password verification:', {
                testPassword,
                isMatch: verifyNew
            });
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyAdminPassword(); 