import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendResetPasswordEmail } from "../config/emailConfig.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, name });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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

// Route for verifying token validity
const verifyToken = async (req, res) => {
  try {
    // If the middleware passes, the token is valid
    // The middleware has already verified the token and attached the userId to req.body
    const userId = req.body.userId;
    
    // Fetch user info (optional, to return user data)
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    return res.json({ 
      success: true,
      message: "Token is valid",
      user: {
        name: user.name,
        email: user.email
      }
    });
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

export { loginUser, registerUser, adminLogin, verifyToken, forgotPassword, resetPassword };
