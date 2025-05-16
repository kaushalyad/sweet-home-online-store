import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
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
    const token = createToken(adminUser._id);
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
  verifyToken,
  refreshToken,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  listUsers,
  updatePassword,
  downloadUserData,
  deleteAccount,
  verifyAdmin
};
