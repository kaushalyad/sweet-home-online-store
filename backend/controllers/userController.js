import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendResetPasswordEmail } from "../config/emailConfig.js";
import logger from "../config/logger.js";

const createToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d' // Token expires in 30 days
    });
  } catch (error) {
    logger.error(`Error creating JWT token: ${error.message}`);
    throw error;
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Validate phone number (Indian format)
    if (!validator.matches(phone, /^[6-9]\d{9}$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian phone number"
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 
          "Email already registered" : 
          "Phone number already registered"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      isEmailVerified: false,
      isPhoneVerified: false
    });

    // Generate token
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Find user
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = createToken(user._id);

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

// Verify token
const verifyToken = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      logger.warn('No user ID in request');
      return res.status(401).json({
        success: false,
        message: "Invalid token"
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
    logger.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
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
    const token = createToken(user._id);

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
      message: "Failed to refresh token"
    });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Processing forgot password request for:', email);

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      return res.json({ success: false, message: "No account found with this email address" });
    }

    // Create reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset password email
    const emailSent = await sendResetPasswordEmail(email, resetToken);
    
    if (!emailSent) {
      console.error('Failed to send reset password email to:', email);
      return res.json({ 
        success: false, 
        message: "Failed to send reset email. Please try again later." 
      });
    }

    console.log('Reset password email sent successfully to:', email);
    res.json({ 
      success: true, 
      message: "Password reset link has been sent to your email" 
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.json({ 
      success: false, 
      message: "An error occurred. Please try again later." 
    });
  }
};

// Route for reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.json({ success: false, message: "Invalid reset link" });
    }

    if (!password || password.length < 8) {
      return res.json({ 
        success: false, 
        message: "Password must be at least 8 characters long" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    const updatedUser = await userModel.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Password has been reset successfully" 
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Reset link has expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: "Invalid reset link" });
    }
    res.json({ 
      success: false, 
      message: "An error occurred. Please try again." 
    });
  }
};

const loginWithPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validate input
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both phone number and password"
      });
    }

    // Find user by phone number
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this phone number"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    logger.error("Phone login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during phone login",
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      logger.warn('No user ID in request');
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      logger.warn(`User not found for ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    logger.info(`Profile fetched successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        notificationSettings: user.notificationSettings
      }
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile data"
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address } = req.body;

    if (!userId) {
      logger.warn('No user ID in request');
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Validate phone if provided
    if (phone && !validator.matches(phone, /^[6-9]\d{9}$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian phone number"
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingUser = await userModel.findOne({ phone, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered"
        });
      }
    }

    // Update user profile
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { 
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      logger.warn(`User not found for ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    logger.info(`Profile updated successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
        isEmailVerified: updatedUser.isEmailVerified,
        isPhoneVerified: updatedUser.isPhoneVerified,
        notificationSettings: updatedUser.notificationSettings
      }
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

export { registerUser, loginUser, verifyToken, refreshToken, adminLogin, forgotPassword, resetPassword, loginWithPhone, getUserProfile, updateUserProfile };
