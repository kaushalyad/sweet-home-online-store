import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectDB;
