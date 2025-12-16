import {v2 as cloudinary } from "cloudinary"
import logger from "./logger.js"

const connectCloudinary = async () => {
    const config = {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
        secure: true
    }
    
    logger.info('Configuring Cloudinary with:', {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? config.api_key.substring(0, 5) + '...' : 'NOT SET',
        api_secret: config.api_secret ? 'SET' : 'NOT SET'
    });
    
    cloudinary.config(config);
    
    logger.info('Cloudinary configured successfully');
}

export default connectCloudinary;