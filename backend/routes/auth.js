import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

export default router;