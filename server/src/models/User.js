const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes lockout

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['officer', 'trainer', 'employer', 'candidate', 'admin'],
    default: 'officer'
  },
  organization: {
    type: String,
    trim: true,
    default: 'District Skill Development Cell'
  },
  district: {
    type: String,
    trim: true,
    default: 'Pune'
  },
  sector: {
    type: String,
    trim: true,
    default: 'Automotive & Mobility'
  },
  designation: {
    type: String,
    trim: true,
    default: 'Skill Planning Officer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if account is locked
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save password hash
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (typeof enteredPassword !== 'string') return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Increment login attempts & lock if exceeded
UserSchema.methods.incLoginAttempts = async function () {
  // If previous lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }
  return await this.updateOne(updates);
};

// Reset attempts on successful login
UserSchema.methods.onLoginSuccess = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 }
  });
};

module.exports = mongoose.model('User', UserSchema);
