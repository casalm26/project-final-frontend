import express from 'express';
import {
  getTrees,
  getTreeById,
  createTree,
  updateTree,
  deleteTree,
  addMeasurement,
  getTreeMeasurements,
  getTreesByForest,
  markTreeDead
} from '../controllers/treeController.js';
import {
  validateTreeCreate,
  validateMeasurement
} from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTrees);
router.get('/:id', getTreeById);
router.get('/:id/measurements', getTreeMeasurements);
router.get('/forest/:forestId', getTreesByForest);

// Protected routes (authenticated users)
router.post('/:id/measurements', authenticateToken, validateMeasurement, addMeasurement);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateTreeCreate, createTree);
router.put('/:id', authenticateToken, requireAdmin, updateTree);
router.delete('/:id', authenticateToken, requireAdmin, deleteTree);
router.patch('/:id/mark-dead', authenticateToken, requireAdmin, markTreeDead);

export default router;