import Message from '../models/messageModel.js'
import logger from '../config/logger.js'

// Create message (public)
export const createMessage = async (req, res) => {
  try {
    const { name, email, message, productId } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' })
    }

    const newMsg = new Message({ name, email, message, productId })
    await newMsg.save()

    logger.info('New message received:', { id: newMsg._id, email })

    return res.json({ success: true, message: 'Message received', data: newMsg })
  } catch (error) {
    logger.error('createMessage error:', error.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

// List messages (admin)
export const listMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200)
    return res.json({ success: true, messages })
  } catch (error) {
    logger.error('listMessages error:', error.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Mark message as handled (admin)
export const handleMessage = async (req, res) => {
  try {
    const { id } = req.params
    const msg = await Message.findById(id)
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    msg.status = 'handled'
    await msg.save()
    return res.json({ success: true, message: 'Message marked handled', data: msg })
  } catch (error) {
    logger.error('handleMessage error:', error.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
