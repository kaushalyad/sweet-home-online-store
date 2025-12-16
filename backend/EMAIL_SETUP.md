# Email Notification Setup Guide

This guide will help you set up email notifications for order confirmations and admin alerts.

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification > App passwords
3. Select "Mail" and "Other (custom name)"
4. Enter "Sweet Home Store" as the custom name
5. Copy the generated 16-character password

### 3. Update Environment Variables
Update your `.env` file in the backend directory:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
ADMIN_EMAIL=admin@sweethome.com
FRONTEND_URL=http://localhost:3000
ADMIN_PANEL_URL=http://localhost:4173
```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_USER=your_email@outlook.com
EMAIL_APP_PASSWORD=your_app_password
```

### Custom SMTP
If using a custom SMTP server, you'll need to modify the `emailService.js` file:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'your_smtp_host',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Features

### Customer Notifications
- **Order Confirmation**: Sent immediately when an order is placed
- **Order Status Updates**: Sent when order status changes (processing, shipped, delivered, etc.)

### Admin Notifications
- **New Order Alerts**: Instant email when any order is received
- **Order Details**: Includes customer info, items, and total amount

## Testing Email Setup

1. Start your backend server
2. Place a test order through the frontend
3. Check both customer and admin email addresses
4. Verify order status update emails by changing order status in admin panel

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Make sure you're using an App Password, not your regular password
   - Verify 2FA is enabled on your Google account

2. **Emails not sending**
   - Check your `.env` file for correct EMAIL_USER and EMAIL_APP_PASSWORD
   - Verify the email address exists and is accessible

3. **Emails going to spam**
   - This is normal for automated emails
   - Consider whitelisting the sender email

### Email Templates

Email templates are located in `backend/utils/emailService.js`. You can customize:
- HTML styling and branding
- Email content and messaging
- Sender information

## Security Notes

- Never commit real email credentials to version control
- Use environment variables for all sensitive data
- Consider using dedicated email services like SendGrid for production
- App passwords are specific to Gmail and provide limited access