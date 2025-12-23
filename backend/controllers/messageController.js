import Message from '../models/messageModel.js'
import logger from '../config/logger.js'
import { sendEmail } from '../utils/emailService.js'

// Create message (public)
export const createMessage = async (req, res) => {
  try {
    const { name, email, message, productId, productName } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    // Check if user already requested notification for this product
    if (productId) {
      const existingNotification = await Message.findOne({
        email,
        productId,
        type: 'product_notification',
        status: { $ne: 'notified' }
      })

      if (existingNotification) {
        return res.json({ 
          success: true, 
          message: 'You are already subscribed for notifications on this product',
          data: existingNotification 
        })
      }
    }

    // Determine message type
    let messageType = 'general'
    if (productId && message.toLowerCase().includes('notify')) {
      messageType = 'product_notification'
    } else if (message.toLowerCase().includes('contact')) {
      messageType = 'contact'
    }

    const newMsg = new Message({ 
      name, 
      email, 
      message, 
      productId,
      productName,
      type: messageType 
    })
    await newMsg.save()

    logger.info('New message received:', { 
      id: newMsg._id, 
      email, 
      type: messageType,
      productName: productName || 'N/A'
    })

    // Send confirmation email to user
    if (messageType === 'product_notification') {
      try {
        await sendEmail({
          to: email,
          subject: `Notification Request Confirmed - ${productName || 'Product'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">🔔 You're on the list!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1f2937;">Hi ${name},</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Thank you for your interest in <strong>${productName || 'our product'}</strong>!
                </p>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  We'll send you an email as soon as it becomes available. Stay tuned! 🎉
                </p>
                <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #ec4899;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Product:</strong> ${productName || 'Coming Soon Product'}
                  </p>
                  <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
                    <strong>Email:</strong> ${email}
                  </p>
                </div>
                <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
                  Best regards,<br/>
                  <strong>Sweet Home Online Store Team</strong>
                </p>
              </div>
              <div style="padding: 20px; text-align: center; background: #1f2937; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Sweet Home Online Store. All rights reserved.</p>
              </div>
            </div>
          `
        })
      } catch (emailError) {
        logger.error('Failed to send confirmation email:', emailError.message)
        // Don't fail the request if email fails
      }
    }

    // Notify admin about new notification request
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@sweethome.com',
        subject: `New ${messageType === 'product_notification' ? 'Product Notification' : 'Message'} Request`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>New ${messageType === 'product_notification' ? 'Product Notification Request' : 'Message'}</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            ${productName ? `<p><strong>Product:</strong> ${productName}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="padding: 15px; background: #f3f4f6; border-radius: 4px;">${message}</p>
            <p><strong>Type:</strong> ${messageType}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            ${productId ? `<p><strong>Product ID:</strong> ${productId}</p>` : ''}
          </div>
        `
      })
    } catch (adminEmailError) {
      logger.error('Failed to send admin notification email:', adminEmailError.message)
    }

    return res.json({ success: true, message: 'Thank you! We will notify you when the product is available.', data: newMsg })
  } catch (error) {
    logger.error('createMessage error:', error.message)
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
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
