import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const checkAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet-home-store');
        console.log('Connected to MongoDB');

        // Find all admin users
        const adminUsers = await userModel.find({ role: 'admin' }).select('+password');
        console.log('\nAll admin users:', adminUsers.map(user => ({
            email: user.email,
            role: user.role,
            id: user._id,
            hasPassword: !!user.password,
            passwordHash: user.password,
            name: user.name,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified
        })));

        // Find specific admin user
        const specificAdmin = await userModel.findOne({ 
            email: 'sweethomeonlinestorehelp@gmail.com' 
        }).select('+password');

        console.log('\nSpecific admin user:', specificAdmin ? {
            email: specificAdmin.email,
            role: specificAdmin.role,
            id: specificAdmin._id,
            hasPassword: !!specificAdmin.password,
            passwordHash: specificAdmin.password,
            name: specificAdmin.name,
            isEmailVerified: specificAdmin.isEmailVerified,
            isPhoneVerified: specificAdmin.isPhoneVerified
        } : 'Not found');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin(); 