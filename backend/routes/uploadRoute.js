import express from 'express'
import { getCloudinarySignature } from '../controllers/uploadController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protected: only authenticated admins can request signatures
router.get('/cloudinary/signature', protect, admin, getCloudinarySignature)

// Test endpoint to verify Cloudinary config
router.get('/cloudinary/test', protect, admin, (req, res) => {
  res.json({
    success: true,
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_NAME ? 'SET' : 'NOT SET',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_SECRET_KEY ? 'SET' : 'NOT SET'
    }
  })
})

export default router
