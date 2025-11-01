const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const secret = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_this_in_production';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = { adminOnly };