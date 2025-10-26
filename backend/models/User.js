const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'educator'],
    default: 'student'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  resetPasswordOTP: {
    type: String
  },
  resetPasswordOTPExpire: {
    type: Date
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset OTP
userSchema.methods.generateResetOTP = function() {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the OTP
  this.resetPasswordOTP = bcrypt.hashSync(otp, 10);
  
  // Set expire time (10 minutes)
  this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
  
  return otp;
};

// Generate password reset token
userSchema.methods.generateResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Set expire time (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  
  return resetToken;
};

// Verify reset OTP
userSchema.methods.verifyResetOTP = function(otp) {
  return bcrypt.compareSync(otp, this.resetPasswordOTP);
};

module.exports = mongoose.model('User', userSchema);
