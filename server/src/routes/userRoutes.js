const express = require('express');
const router = express.Router();
const { getAllUsers, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public/Common endpoints
router.get('/', getAllUsers);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;
