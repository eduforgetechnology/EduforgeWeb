const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user with validated role
    const validatedRole = ['student', 'educator'].includes(role) ? role : 'student';
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: validatedRole 
    });

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn('JWT_SECRET not set, using default secret');
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      secret || 'your_secure_jwt_secret_key_change_this_in_production', 
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Send response
    res.status(201).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn('JWT_SECRET not set, using default secret');
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      secret || 'your_secure_jwt_secret_key_change_this_in_production', 
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Send response
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email address' });
    }

    // Generate OTP and reset token
    const otp = user.generateResetOTP();
    const resetToken = user.generateResetToken();

    await user.save({ validateBeforeSave: false });

    // Send email with OTP
    const nodemailer = require('nodemailer');
    
    // Create transporter using your existing email configuration
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Get frontend URL for email link
    const corsOrigins = process.env.CORS_ORIGIN ;
    const frontendUrl = corsOrigins.split(',')[0];
    
    const message = `
      <h2>Password Reset Request</h2>
      <p>You have requested a password reset for your EduForge account.</p>
      <p><strong>Your OTP is: ${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>Alternatively, you can click the link below to reset your password:</p>
      <a href="${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}">Reset Password</a>
      <p>If you didn't request this password reset, please ignore this email.</p>
    `;

    await transporter.sendMail({
      to: user.email,
      subject: 'EduForge - Password Reset Request',
      html: message
    });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email',
      // For development/testing - remove in production
      ...(process.env.NODE_ENV === 'development' && { otp, resetToken })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Reset fields if email sending failed
    if (error.code === 'EAUTH' || error.code === 'ENOTFOUND') {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
      return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }

    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTPExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isValidOTP = user.verifyResetOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate a temporary token for password reset
    const tempToken = jwt.sign(
      { id: user._id, type: 'password-reset' },
      process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_this_in_production',
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken: tempToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  try {
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_this_in_production');
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid token type' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route GET /api/auth/reset-password/:token (for email link)
router.get('/reset-password/:token', async (req, res) => {
  try {
    const crypto = require('crypto');
    
    // Hash token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Generate JWT token for frontend
    const jwtToken = jwt.sign(
      { id: user._id, type: 'password-reset' },
      process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_this_in_production',
      { expiresIn: '15m' }
    );

    // Redirect to frontend reset password page with token
    // Get the first frontend URL from CORS_ORIGIN or use localhost as fallback
    const corsOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';
    const frontendUrl = corsOrigins.split(',')[0];
    res.redirect(`${frontendUrl}/reset-password?token=${jwtToken}`);

  } catch (error) {
    console.error('Reset password link error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
