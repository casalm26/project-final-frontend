import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
  logoutAll
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (with stricter rate limiting for auth)
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.post('/refresh', authLimiter, refreshToken);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);
router.post('/logout-all', authenticateToken, logoutAll);

export default router;