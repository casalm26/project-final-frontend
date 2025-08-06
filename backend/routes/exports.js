import express from 'express';
import {
  exportTreesCSV,
  exportTreesXLSX,
  exportForestAnalytics,
  diagnosticTreeCount
} from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// DEBUG: Diagnostic endpoint (no auth required for debugging)
router.get('/diagnostic', diagnosticTreeCount);

// All export routes require authentication
router.use(authenticateToken);

// Trees export endpoints
router.get('/trees/csv', exportTreesCSV);
router.get('/trees/xlsx', exportTreesXLSX);

// Forest analytics export
router.get('/forest-analytics', exportForestAnalytics);

export default router;