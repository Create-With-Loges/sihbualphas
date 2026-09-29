const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Email regex validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper to generate JWT token with expiration and user claims
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256'
    }
  );

  const safeUserData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    district: user.district,
    sector: user.sector,
    designation: user.designation,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: safeUserData
  });
};

/**
 * @desc    Register a new user securely
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organization, district, sector, designation } = req.body;

    // Strict input type validation to prevent NoSQL injection
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format. Name, email, and password must be text strings.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.'
      });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Password complexity: minimum 8 chars, at least one letter and one number
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one letter and one number.'
      });
    }

    // Check existing account
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    const allowedRoles = ['officer', 'trainer', 'employer', 'candidate'];
    const assignedRole = allowedRoles.includes(role) ? role : 'officer';

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      role: assignedRole,
      organization: typeof organization === 'string' && organization.trim() ? organization.trim() : 'District Skill Development Cell',
      district: typeof district === 'string' && district.trim() ? district.trim() : 'Pune',
      sector: typeof sector === 'string' && sector.trim() ? sector.trim() : 'Automotive & Mobility',
      designation: typeof designation === 'string' && designation.trim() ? designation.trim() : 'Skill Planning Officer'
    });

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to the platform.');
  } catch (err) {
    console.error('[Register Security Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Secure registration error. Please verify input data.'
    });
  }
};

/**
 * @desc    Login user securely with brute-force lockout protection
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials format.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user and explicitly select password and security fields
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    // Generic error message to prevent user enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Check brute-force lock
    if (user.isLocked) {
      const minutesRemaining = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`
      });
    }

    // Verify password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Reset attempts on successful authentication
    await user.onLoginSuccess();

    sendTokenResponse(user, 200, res, `Authenticated successfully as ${user.name}`);
  } catch (err) {
    console.error('[Login Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

/**
 * @desc    Verify current session token
 * @route   GET /api/auth/verify
 * @access  Private
 */
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Session is no longer valid.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid session token.'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, organization, district, sector, designation, role } = req.body;
    const updates = {};

    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof organization === 'string') updates.organization = organization.trim();
    if (typeof district === 'string') updates.district = district.trim();
    if (typeof sector === 'string') updates.sector = sector.trim();
    if (typeof designation === 'string') updates.designation = designation.trim();

    if (role && ['officer', 'trainer', 'employer', 'candidate'].includes(role)) {
      updates.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Common user directory lookup
 * @route   GET /api/users
 * @access  Public
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, sector, district } = req.query;
    const filter = { isActive: true };

    if (role) filter.role = role;
    if (sector) filter.sector = sector;
    if (district) filter.district = district;

    const users = await User.find(filter)
      .select('-password -loginAttempts -lockUntil')
      .sort({ createdAt: -1 })
      .limit(60);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Ensure default role accounts exist with secure hashing
 */
exports.ensureDemoUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[Auth] Seeding default stakeholder accounts...');
      const demoUsers = [
        {
          name: 'Dr. Ramesh Sharma',
          email: 'officer@skillpulse.gov.in',
          password: 'Password123!',
          role: 'officer',
          organization: 'State Skill Development Mission (SSDM)',
          district: 'Pune',
          sector: 'Automotive & Mobility',
          designation: 'Chief District Skill Planning Officer'
        },
        {
          name: 'Prof. Ananya Sen',
          email: 'trainer@skillpulse.edu.in',
          password: 'Password123!',
          role: 'trainer',
          organization: 'National Skill Training Institute (NSTI)',
          district: 'Bengaluru Urban',
          sector: 'Information Technology & Electronics',
          designation: 'Faculty Lead & Lab Head'
        },
        {
          name: 'Vikramaditya Roy',
          email: 'employer@tata.com',
          password: 'Password123!',
          role: 'employer',
          organization: 'Tata Motors EV Systems Division',
          district: 'Pune',
          sector: 'Automotive & Mobility',
          designation: 'VP - Talent Acquisition & Industrial Relations'
        },
        {
          name: 'Pooja Kulkarni',
          email: 'candidate@skillpulse.org',
          password: 'Password123!',
          role: 'candidate',
          organization: 'Government Polytechnic Pune',
          district: 'Pune',
          sector: 'Automotive & Mobility',
          designation: 'Vocational Trainee'
        }
      ];

      for (const u of demoUsers) {
        await User.create(u);
      }
      console.log('[Auth] Default stakeholder accounts created.');
    }
  } catch (err) {
    console.warn('[Auth Note]:', err.message);
  }
};
