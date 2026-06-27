const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
const { sendWelcomeEmail } = require('../services/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, studentId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists' });
    }

    // Check system settings for registration permissions
    const systemConfig = await SystemConfig.findOne();
    if (systemConfig && !systemConfig.allowSelfRegistration && role === 'student') {
      return res.status(400).json({ success: false, error: 'Student registration is currently disabled by administration' });
    }

    // Set default password if none provided (useful for preset signups)
    const finalPassword = password || 'password123';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: finalPassword,
      role: role || 'student',
      department,
      usn: studentId, // Map studentId to USN field
    });

    if (user) {
      // Trigger Welcome Email (Async)
      sendWelcomeEmail(user);

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.usn,
          hoursLogged: user.hoursLogged,
          points: user.points,
          avatar: user.avatar,
          bio: user.bio,
          joinDate: user.joinDate.toISOString().split('T')[0],
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, role, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide email' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or credentials' });
    }

    // Verify role matches (important for system boundaries)
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, error: `Invalid credentials for role: ${role}` });
    }

    // Verify password if it's sent (or check against seeded password defaults if they skipped it)
    const finalPassword = password || 'password123';
    const isMatch = await user.matchPassword(finalPassword);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.usn,
        hoursLogged: user.hoursLogged,
        points: user.points,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate.toISOString().split('T')[0],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log out user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // In stateless JWT, logout is handled client-side by destroying token.
    // Return standard success response.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to expire field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // In a real application, we would send a reset email. For Ethereal / development testing:
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log(`----------------------------------------`);
    console.log(`🔑 PASSWORD RESET REQUESTED!`);
    console.log(`To reset password, click: ${resetUrl}`);
    console.log(`----------------------------------------`);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent (please check backend console logs for Ethereal URL reset link)',
      resetToken // sending token in body for easy testing/sandbox usage
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, error: 'Please provide token and new password' });
    }

    // Hash token sent
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
