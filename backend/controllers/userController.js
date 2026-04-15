import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import logger from "../config/logger.js";
import { sendAdminNewCustomerNotification, sendEmail } from "../utils/emailService.js";
import axios from "axios";

const createToken = (payload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const tokenPayload = typeof payload === 'string' || typeof payload === 'number'
      ? { id: payload }
      : { ...payload };

    return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d' // Token expires in 30 days
    });
  } catch (error) {
    logger.error(`Error creating JWT token: ${error.message}`);
    throw error;
  }
};

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const normalizePhoneDigits = (raw) => {
  let phone = String(raw || "").trim();
  
  // Remove +91 prefix if present
  if (phone.startsWith('+91')) {
    phone = phone.slice(3);
  }
  
  // Remove all non-digits
  let digits = phone.replace(/\D/g, "");
  
  // Handle leading 0 for 11-digit numbers (after removing +91)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // Handle 91 prefix for 12-digit numbers
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  
  return digits.length === 10 ? digits : null;
};

const normalizeIdentifier = (identifier) => {
  const raw = String(identifier || "").trim();
  const email = validator.isEmail(raw) ? raw.toLowerCase() : null;
  const phone = normalizePhoneDigits(raw);
  return { raw, email, phone };
};

const buildIdentifierQuery = (email, phone) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (phone) conditions.push({ phone });
  return conditions.length ? { $or: conditions } : null;
};

const sendSmsViaMsg91 = async (phoneNumber, otpMessage) => {
  try {
    // Normalize phone number to remove country codes
    let formattedPhone = String(phoneNumber).trim();
    
    // Remove +91 prefix if present
    if (formattedPhone.startsWith('+91')) {
      formattedPhone = formattedPhone.slice(3);
    }
    // Remove 91 prefix for 12-digit numbers
    if (formattedPhone.length === 12 && formattedPhone.startsWith('91')) {
      formattedPhone = formattedPhone.slice(2);
    }
    // Remove any remaining non-digits
    formattedPhone = formattedPhone.replace(/\D/g, '');
    
    // Ensure it's 10 digits
    if (formattedPhone.length !== 10) {
      throw new Error(`Invalid phone number format: ${phoneNumber}`);
    }

    // Using MSG91 v5 OTP API with template
    const url = 'https://api.msg91.com/api/v5/otp';
    
    const headers = {
      'Content-Type': 'application/json',
      'authkey': process.env.MSG91_API_KEY
    };

    // Extract OTP code from message (format: "123456 is your OTP...")
    const otpCode = otpMessage.split(' ')[0];

    // MSG91 v5 OTP API with template
    const data = {
      mobile: formattedPhone,
      otp: otpCode,
      template_id: process.env.MSG91_TEMPLATE_ID || ''
    };

    logger.info('Sending OTP via MSG91 v5 API with template', {
      url,
      mobile: formattedPhone,
      templateId: process.env.MSG91_TEMPLATE_ID,
      otpLength: otpCode.length
    });

    const response = await axios.post(url, data, { headers });

    logger.info('MSG91 v5 API response received', {
      status: response.status,
      responseData: JSON.stringify(response.data)
    });

    // MSG91 v5 API returns success with type: "success" or request_id
    if (response.status === 200 && (response.data.type === 'success' || response.data.request_id)) {
      logger.info('OTP sent successfully via MSG91 v5 API', {
        requestId: response.data.request_id,
        message: response.data.message,
        templateId: process.env.MSG91_TEMPLATE_ID
      });
      return response;
    } else {
      const message = response.data.message || JSON.stringify(response.data);
      const error = new Error(`MSG91 v5 API error: ${message}`);
      error.response = { status: response.status, data: response.data };
      throw error;
    }
  } catch (error) {
    logger.error(`MSG91 v5 API failed: ${error.message}`, {
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    throw error;
  }
};

const dispatchOtpToUser = async (user) => {
  const otpCode = generateOtpCode();
  user.otpCode = otpCode;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  let emailSentTo;
  let phoneSentTo;
  const deliveryErrors = [];

  // PRIORITY 1: Try SMS/Mobile OTP first (like Flipkart)
  if (user.phone) {
    try {
      if (!process.env.MSG91_API_KEY) {
        throw new Error("MSG91_API_KEY is not configured");
      }
      const phoneNumber = user.phone;
      const otpMessage = `${otpCode} is your OTP. Valid for 10 minutes.`;
      
      logger.info(`[PRIORITY SMS] Sending registration OTP SMS to ${phoneNumber} with message: ${otpMessage}`);
      
      const response = await sendSmsViaMsg91(phoneNumber, otpMessage);
      
      logger.info(`OTP SMS sent successfully to ${user.phone}`, { 
        response: JSON.stringify(response.data),
        status: response.status
      });
      phoneSentTo = user.phone;
    } catch (error) {
      const smsErrorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Msg91 request failed";
      logger.warn(`SMS delivery failed for registration, will try email fallback: ${smsErrorMessage}`);
      deliveryErrors.push(`sms: ${smsErrorMessage}`);
      // Continue to try email as fallback
    }
  }

  // FALLBACK: Try email if SMS failed or no phone number
  if (!phoneSentTo && user.email) {
    try {
      logger.info(`[FALLBACK EMAIL] Sending registration OTP email to ${user.email}`);
      await sendEmail({
        to: user.email,
        subject: "Your Sweet Home verification OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2874f0;">Sweet Home Store</h2>
            <p>Your registration OTP is <strong>${otpCode}</strong>.</p>
            <p>This code is valid for 10 minutes.</p>
            <p style="color: #666; font-size: 12px;">(Sent via email as SMS delivery failed)</p>
          </div>`
      });
      emailSentTo = user.email;
      logger.info(`OTP sent successfully via email to ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send OTP email to ${user.email}: ${error.message}`, { stack: error.stack });
      deliveryErrors.push(`email: ${error.message}`);
    }
  }

  return {
    emailSentTo,
    phoneSentTo,
    deliveryErrors
  };
};

// Check if identifier (email or phone) already exists
const checkIdentifierExists = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email or mobile number"
      });
    }

    const { email, phone } = normalizeIdentifier(identifier);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address or 10-digit mobile number"
      });
    }

    const userQuery = buildIdentifierQuery(email, phone);
    const existingUser = await userModel.findOne(userQuery);

    if (existingUser) {
      return res.status(200).json({
        success: true,
        exists: true,
        identifier: existingUser.email || existingUser.phone,
        email: existingUser.email,
        phone: existingUser.phone,
        message: existingUser.email === email ? 
          "Email already registered" : 
          "Phone number already registered"
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: "Identifier is available"
    });
  } catch (error) {
    logger.error(`checkIdentifierExists error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error checking identifier"
    });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, identifier, password, email: bodyEmail, phone: bodyPhone } = req.body;

    let email = null;
    let phone = null;

    if (identifier) {
      const normalized = normalizeIdentifier(identifier);
      email = normalized.email;
      phone = normalized.phone;
    }

    if (bodyEmail) {
      const emailCandidate = String(bodyEmail || "").trim().toLowerCase();
      if (!validator.isEmail(emailCandidate)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address"
        });
      }
      email = emailCandidate;
    }

    if (bodyPhone) {
      const normalizedPhone = normalizePhoneDigits(bodyPhone);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid 10-digit mobile number"
        });
      }
      phone = normalizedPhone;
    }

    // Validate input
    if (!identifier && !bodyEmail && !bodyPhone) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email or mobile number"
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address or 10-digit mobile number"
      });
    }

    if (email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide a mobile number to complete registration"
      });
    }

    if (password && password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Check if user already exists
    const existingUserQuery = buildIdentifierQuery(email, phone);
    const existingUser = await userModel.findOne(existingUserQuery);

    if (existingUser) {
      let conflictMessage = "User already registered";
      if (email && existingUser.email === email) {
        conflictMessage = "Email already registered";
      } else if (phone && existingUser.phone === phone) {
        conflictMessage = "Phone number already registered";
      }
      return res.status(400).json({
        success: false,
        message: conflictMessage
      });
    }

    const userPassword = password || crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create new user
    const userData = {
      name: name || "User", // Default name if not provided
      password: hashedPassword,
      isEmailVerified: false,
      isPhoneVerified: false
    };
    if (email) userData.email = email;
    if (phone) userData.phone = phone;

    const user = await userModel.create(userData);

    const otpTargets = await dispatchOtpToUser(user);

    if (!otpTargets.emailSentTo && !otpTargets.phoneSentTo) {
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP. ${otpTargets.deliveryErrors.join(' | ')}`
      });
    }

    sendAdminNewCustomerNotification({
      name: user.name || "New User",
      email: user.email,
      phone: user.phone,
    }).catch((err) =>
      logger.error("Failed to send owner new-signup email:", err)
    );

    res.status(201).json({
      success: true,
      message: otpTargets.phoneSentTo 
        ? "Registration successful. OTP sent to your mobile number." 
        : "Registration successful. OTP sent to your email.",
      identifier: user.email || user.phone,
      emailSentTo: otpTargets.emailSentTo,
      phoneSentTo: otpTargets.phoneSentTo,
      otpSentVia: otpTargets.phoneSentTo ? 'sms' : 'email'
    });

  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again."
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide either email or phone number and password"
      });
    }

    // Find user by email or phone
    const user = await userModel.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = createToken({ id: user._id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
};

// Send OTP for login
const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    const { email, phone } = normalizeIdentifier(identifier);

    logger.info(`sendOtp - Normalized input: email=${email}, phone=${phone}`);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or 10-digit mobile number"
      });
    }

    const userQuery = buildIdentifierQuery(email, phone);
    const user = await userModel.findOne(userQuery);

    if (user) {
      logger.info(`sendOtp - Found user: email=${user.email}, phone=${user.phone}`);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found for that email or mobile number. Please register first."
      });
    }

    const otpCode = generateOtpCode();
    user.otpCode = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    let delivered = false;
    let deliveryError = null;
    let sentVia = null;

    // PRIORITY 1: Try SMS/Mobile OTP first (like Flipkart)
    if (user.phone) {
      try {
        if (!process.env.MSG91_API_KEY) {
          throw new Error("MSG91_API_KEY is not configured");
        }
        const phoneNumber = user.phone;
        const otpMessage = `${otpCode} is your OTP. Valid for 10 minutes.`;
        
        logger.info(`[PRIORITY SMS] Sending OTP SMS to ${phoneNumber} with message: ${otpMessage}`);
        
        const response = await sendSmsViaMsg91(phoneNumber, otpMessage);
        
        logger.info(`OTP SMS sent successfully to ${user.phone}`, { 
          response: JSON.stringify(response.data),
          status: response.status
        });
        delivered = true;
        sentVia = 'sms';
      } catch (error) {
        const smsErrorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "SMS delivery failed";
        logger.warn(`SMS delivery failed, will try email fallback: ${smsErrorMessage}`);
        deliveryError = smsErrorMessage;
        // Fall through to try email as fallback
      }
    }

    // FALLBACK: Try email if SMS failed or no phone number
    if (!delivered && user.email) {
      try {
        logger.info(`[FALLBACK EMAIL] Sending OTP email to ${user.email}`);
        await sendEmail({
          to: user.email,
          subject: "Your Sweet Home OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2874f0;">Sweet Home Store</h2>
              <p>Your login OTP is <strong>${otpCode}</strong>.</p>
              <p>This code is valid for 10 minutes.</p>
              <p style="color: #666; font-size: 12px;">(Sent via email as SMS delivery failed)</p>
            </div>`
        });
        delivered = true;
        sentVia = 'email';
        logger.info(`OTP sent successfully via email to ${user.email}`);
      } catch (error) {
        logger.error(`Failed to send OTP email to ${user.email}: ${error.message}`, { stack: error.stack });
        deliveryError = `Email: ${error.message}. SMS: ${deliveryError}`;
      }
    }

    if (!delivered) {
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP. ${deliveryError || "Please check your email or mobile number and try again."}`
      });
    }

    res.json({
      success: true,
      message: sentVia === 'sms' 
        ? "OTP sent to your mobile number. Please enter it within 10 minutes." 
        : "OTP sent to your email. Please enter it within 10 minutes.",
      sentVia: sentVia,
      emailSentTo: sentVia === 'email' ? user.email : undefined,
      phoneSentTo: sentVia === 'sms' ? user.phone : undefined
    });
  } catch (error) {
    logger.error(`Send OTP error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again."
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const { email, phone } = normalizeIdentifier(identifier);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or 10-digit mobile number"
      });
    }

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Please enter the 6-digit OTP"
      });
    }

    const userQuery = buildIdentifierQuery(email, phone);
    const user = await userModel.findOne(userQuery);

    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new OTP."
      });
    }

    if (user.otpCode !== String(otp).trim() || user.otpExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new OTP."
      });
    }

    user.otpCode = undefined;
    user.otpExpires = undefined;
    if (email) user.isEmailVerified = true;
    if (phone) user.isPhoneVerified = true;
    user.lastLogin = new Date();
    await user.save();

    const token = createToken({ id: user._id, email: user.email, role: user.role });
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    logger.error(`Verify OTP error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again."
    });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  try {
    let userId;
    
    // Check if user is authenticated through middleware
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else if (req.body.token) {
      // Verify token from request body
      try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (error) {
        logger.warn('Invalid token provided in request body');
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      }
    } else {
      logger.warn('No user ID or token in request');
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      logger.warn(`User not found for ID: ${userId}`);
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    logger.info(`Token verified successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Token verification failed"
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Create new token
    const token = createToken({ id: user._id, email: user.email, role: user.role });

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: "Token refresh failed"
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', {
      email,
      hasPassword: !!password,
      passwordLength: password?.length
    });

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'sweethomeonlinestorehelp@gmail.com';
    const ADMIN_PASSWORD = 'Kaushalyad@123';

    if (!email || !password) {
      console.log('Missing credentials:', { email, hasPassword: !!password });
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('Invalid credentials:', { 
        email,
        providedEmail: email === ADMIN_EMAIL,
        providedPassword: password === ADMIN_PASSWORD
      });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Find or create admin user
    let adminUser = await userModel.findOne({ email: ADMIN_EMAIL });
    
    if (!adminUser) {
      // Create admin user if it doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      adminUser = await userModel.create({
        name: 'Admin User',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        isPhoneVerified: true
      });
      
      console.log('Admin user created:', {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role
      });
    }

    // Create token with proper ObjectId
    const token = createToken({ id: adminUser._id, email: adminUser.email, role: adminUser.role });
    console.log('Login successful:', { 
      email, 
      userId: adminUser._id,
      tokenLength: token.length
    });

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message, '\nStack:', error.stack);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        notificationSettings: user.notificationSettings,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get profile"
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name) user.name = name;
    if (phone) {
      if (!validator.matches(phone, /^[6-9]\d{9}$/)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid Indian phone number"
        });
      }
      user.phone = phone;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// List users (admin only)
const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    console.log('List users request:', {
      page,
      limit,
      search,
      role,
      user: req.user ? {
        id: req.user._id,
        role: req.user.role
      } : null
    });

    const query = {};

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Add role filter if provided
    if (role) {
      query.role = role;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await userModel.countDocuments(query);
    console.log('Total users found:', total);

    // Get users with pagination
    const users = await userModel.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Users retrieved:', {
      count: users.length,
      firstUser: users[0] ? {
        id: users[0]._id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      } : null
    });

    res.json({
      success: true,
      users: users || [],
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('List users error:', error.message, '\nStack:', error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to list users"
    });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new password"
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    // Find user
    const user = await userModel.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    logger.error(`Password update error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update password. Please try again."
    });
  }
};
// Forgot Password - Send reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send email with reset link
    const { sendPasswordResetEmail } = await import('../utils/emailService.js');
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl
    });

    res.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    });

  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to process request"
    });
  }
};

// Reset Password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};
// Download user data
const downloadUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prepare user data for download
    const userData = {
      personalInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      preferences: {
        notificationSettings: user.notificationSettings
      }
    };

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');

    // Send the data
    res.json(userData);

  } catch (error) {
    logger.error(`Download user data error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to download user data"
    });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your password to confirm account deletion"
      });
    }

    // Find user
    const user = await userModel.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Prevent admin account deletion
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted"
      });
    }

    // Delete user
    await userModel.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    logger.error(`Delete account error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });
  }
};

// Verify admin status
const verifyAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      isAdmin: user.role === 'admin',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    logger.error(`Admin verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to verify admin status"
    });
  }
};

export {
  registerUser,
  loginUser,
  checkIdentifierExists,
  sendOtp,
  verifyOtp,
  verifyToken,
  refreshToken,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  listUsers,
  updatePassword,
  downloadUserData,
  deleteAccount,
  forgotPassword,
  resetPassword,
  verifyAdmin
};
