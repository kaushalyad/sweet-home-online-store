import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // App-specific password for Gmail
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service error:', error);
  } else {
    logger.info('Email service is ready to send messages');
  }
});

// Generic send email function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"Sweet Home Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Order confirmation email template
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderDate
    } = orderData;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image?.[0] || '/placeholder.jpg'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Sweet Home Store" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - Order #${orderId.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF6B35; color: white; padding: 20px; text-align: center;">
            <h1>Sweet Home Store</h1>
            <h2>Order Confirmation</h2>
          </div>

          <div style="padding: 20px;">
            <p>Dear ${customerName},</p>

            <p>Thank you for your order! We're excited to prepare your delicious sweets.</p>

            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString('en-IN')}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            </div>

            <h3>Items Ordered:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Price</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px; font-weight: bold; color: #FF6B35;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Shipping Address:</h3>
              <p>
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                ${shippingAddress.country}<br>
                Phone: ${shippingAddress.phone}<br>
                Email: ${shippingAddress.email}
              </p>
            </div>

            <div style="background-color: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h4>What's Next?</h4>
              <ul>
                <li>We'll start preparing your order within 2-3 hours</li>
                <li>You'll receive updates on your order status</li>
                <li>Fresh sweets will be delivered within 24-48 hours</li>
                <li>Perishable items are packed with ice packs for freshness</li>
              </ul>
            </div>

            <p>If you have any questions, please contact us at ${process.env.EMAIL_USER} or call us at our helpline.</p>

            <p>Happy Shopping!<br>
            <strong>Sweet Home Store Team</strong></p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2025 Sweet Home Store. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Order confirmation email sent to ${customerEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    logger.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Admin notification email
export const sendAdminOrderNotification = async (orderData) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      items,
      totalAmount,
      paymentMethod,
      orderDate
    } = orderData;

    const itemsText = items.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');

    const mailOptions = {
      from: `"Sweet Home Store" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🚨 New Order Received - ₹${totalAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>🛒 New Order Alert!</h1>
          </div>

          <div style="padding: 20px;">
            <h2>New Order Details</h2>

            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Order ID:</strong> ${orderId.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleString('en-IN')}</p>
            </div>

            <h3>Items Ordered:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <pre style="font-family: Arial, sans-serif; white-space: pre-line;">${itemsText}</pre>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:4173'}/orders"
                 style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Order Details
              </a>
            </div>

            <p>Please process this order promptly to ensure timely delivery.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Admin notification email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    logger.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

// Order status update email
export const sendOrderStatusUpdateEmail = async (orderData) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      newStatus,
      orderDate
    } = orderData;

    const statusMessages = {
      'processing': 'We\'ve started preparing your delicious sweets!',
      'shipped': 'Your order has been shipped and is on its way!',
      'delivered': 'Your order has been delivered successfully!',
      'cancelled': 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: `"Sweet Home Store" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Status Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF6B35; color: white; padding: 20px; text-align: center;">
            <h1>Sweet Home Store</h1>
            <h2>Order Status Update</h2>
          </div>

          <div style="padding: 20px; text-align: center;">
            <h3>Order #${orderId.toString().slice(-8).toUpperCase()}</h3>

            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #28a745; margin: 0;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</h2>
              <p style="margin: 10px 0;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            </div>

            <p>Thank you for choosing Sweet Home Store!</p>

            <div style="margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders"
                 style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Track Your Order
              </a>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Order status update email sent to ${customerEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    logger.error('Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

// Password reset email
export const sendPasswordResetEmail = async (userData) => {
  try {
    const { email, name, resetUrl } = userData;

    const mailOptions = {
      from: `"Sweet Home Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #FF6B35; color: white; padding: 20px; text-align: center;">
            <h1>Sweet Home Store</h1>
            <h2>Password Reset</h2>
          </div>

          <div style="padding: 20px;">
            <p>Hi ${name},</p>

            <p>You requested a password reset for your Sweet Home Store account.</p>

            <p>Please click the button below to reset your password. This link will expire in 1 hour for security reasons.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #FF6B35;">${resetUrl}</a>
              </p>
            </div>

            <p>For security reasons, this link will expire in 1 hour.</p>

            <p>Best regards,<br>
            <strong>Sweet Home Store Team</strong></p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2025 Sweet Home Store. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    logger.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;