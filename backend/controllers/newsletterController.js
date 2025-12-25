import Newsletter from '../models/newsletterModel.js';
import { sendEmail } from '../utils/emailService.js';
import logger from '../utils/logger.js';

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // Create new subscription
    const newSubscriber = new Newsletter({
      email: email.toLowerCase()
    });

    await newSubscriber.save();

    // Send welcome email
    try {
      const emailSubject = 'Welcome to Sweet Home Newsletter!';
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
            .button { display: inline-block; background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            h1 { margin: 0; font-size: 24px; }
            .emoji { font-size: 40px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🍬</div>
              <h1>Welcome to Sweet Home!</h1>
            </div>
            <div class="content">
              <h2>Thank you for subscribing! 🎉</h2>
              <p>We're thrilled to have you join our sweet community!</p>
              <p>As a subscriber, you'll be the first to know about:</p>
              <ul>
                <li>🎁 Exclusive offers and discounts</li>
                <li>🆕 New product launches</li>
                <li>🎊 Festive special collections</li>
                <li>📦 Limited time deals</li>
              </ul>
              <p>Get ready to satisfy your sweet cravings with our authentic Indian sweets delivered right to your doorstep!</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Start Shopping</a>
            </div>
            <div class="footer">
              <p>Sweet Home - Authentic Indian Sweets</p>
              <p>You received this email because you subscribed to our newsletter.</p>
              <p style="font-size: 12px; margin-top: 10px;">
                Want to unsubscribe? <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe">Click here</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({ 
        to: email, 
        subject: emailSubject, 
        html: emailHtml 
      });
      logger.info(`Welcome email sent to: ${email}`);
    } catch (emailError) {
      logger.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Check your email for confirmation.'
    });

  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    logger.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again later.'
    });
  }
};

// Get all subscribers (Admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const subscribers = await Newsletter.find(filter).sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });

  } catch (error) {
    logger.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
};

export { subscribe, unsubscribe, getAllSubscribers };
