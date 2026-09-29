const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'skillpulse_secret_jwt_key_2026_super_secure';

// Protect routes - JWT verification
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token.'
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account for this session no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired. Please sign in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid session authentication.'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'unauthorized'}' does not have permission for this resource.`
      });
    }
    next();
  };
};

exports.JWT_SECRET = JWT_SECRET;
