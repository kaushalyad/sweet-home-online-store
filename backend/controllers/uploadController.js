import { v2 as cloudinary } from 'cloudinary'
import logger from '../config/logger.js'

// Returns a Cloudinary signature and related params for direct browser uploads
const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000)

    // Create params object with all fields that will be sent to Cloudinary
    const paramsToSign = {
      timestamp: timestamp
    }

    // Sign the parameters using Cloudinary's utility
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_SECRET_KEY)

    logger.info('Generated Cloudinary signature:', { timestamp, signature });

    return res.json({
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_NAME
      }
    })
  } catch (error) {
    logger.error('Failed to generate Cloudinary signature:', error)
    return res.status(500).json({ success: false, message: 'Failed to generate signature' })
  }
}

// Signature for authenticated users to upload review media (image/video) directly to Cloudinary.
// Clients should choose the Cloudinary upload endpoint based on resourceType:
// - image: https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
// - video: https://api.cloudinary.com/v1_1/<cloud_name>/video/upload
const getReviewUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const { productId, resourceType = 'image' } = req.query;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const type = resourceType === 'video' ? 'video' : 'image';
    const userId = req.user?.id || 'anonymous';

    const folder = `reviews/${productId}/${userId}`;
    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY
    );

    return res.json({
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_NAME,
        folder,
        resourceType: type
      }
    });
  } catch (error) {
    logger.error('Failed to generate review upload signature:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate signature' });
  }
};

export { getCloudinarySignature, getReviewUploadSignature }
