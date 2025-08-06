import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  revokeUserTokens,
  getUserStatistics
} from '../controllers/userController.js';
import {
  validateUserCreate,
  validateUserUpdate
} from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// User statistics
router.get('/statistics', getUserStatistics);

// User CRUD operations
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', adminLimiter, validateUserCreate, createUser);
router.put('/:id', adminLimiter, validateUserUpdate, updateUser);
router.delete('/:id', adminLimiter, deleteUser);

// User token management
router.post('/:id/revoke-tokens', adminLimiter, revokeUserTokens);

export default router;