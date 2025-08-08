import express from 'express';
import {
  exportTreesCSV,
  exportTreesXLSX,
  exportForestAnalytics
} from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All export routes require authentication
router.use(authenticateToken);

// Trees export endpoints
router.get('/trees/csv', exportTreesCSV);
router.get('/trees/xlsx', exportTreesXLSX);

// Forest analytics export
router.get('/forest-analytics', exportForestAnalytics);

export default router;