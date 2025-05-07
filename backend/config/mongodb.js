import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        // Set up Mongoose event listeners
        mongoose.connection.on('connected', () => {
            logger.info("MongoDB connected successfully.");
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err}`);
            // Don't exit process on connection error, let the app handle it
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn("MongoDB connection disconnected.");
        });

        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };

        // Connect to MongoDB with retry logic
        let retries = 5;
        while (retries > 0) {
            try {
                const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweet-home-store';
                await mongoose.connect(uri, options);
                break;
            } catch (error) {
                retries--;
                if (retries === 0) {
                    logger.error(`Failed to connect to MongoDB after 5 attempts: ${error.message}`);
                    throw error;
                }
                logger.warn(`MongoDB connection attempt failed. Retrying... (${retries} attempts remaining)`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retrying
            }
        }

    } catch (error) {
        logger.error(`Database connection error: ${error.message}`);
        // Don't exit process, let the app handle the error
        throw error;
    }
};

export default connectDB;
