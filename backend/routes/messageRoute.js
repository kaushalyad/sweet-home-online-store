import express from 'express'
import { createMessage, listMessages, handleMessage } from '../controllers/messageController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public: submit a message / notify request
router.post('/', createMessage)

// Admin: list messages
router.get('/', protect, admin, listMessages)

// Admin: mark handled
router.put('/:id/handle', protect, admin, handleMessage)

export default router
