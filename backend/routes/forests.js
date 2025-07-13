import express from 'express';
import {
  getForests,
  getForestById,
  createForest,
  updateForest,
  deleteForest,
  getForestAnalytics
} from '../controllers/forestController.js';
import { validateForestCreate } from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional authentication)
router.get('/', getForests);
router.get('/:id', getForestById);
router.get('/:id/analytics', getForestAnalytics);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, validateForestCreate, createForest);
router.put('/:id', authenticateToken, requireAdmin, validateForestCreate, updateForest);
router.delete('/:id', authenticateToken, requireAdmin, deleteForest);

export default router;