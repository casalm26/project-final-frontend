import express from 'express';
import {
  getDashboardStats,
  getQuickStats,
  getForestComparison
} from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';
import { dataLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Apply data rate limiting to prevent abuse
router.use(dataLimiter);

// Dashboard statistics endpoints
router.get('/stats', getDashboardStats);
router.get('/quick-stats', getQuickStats);
router.get('/forest-comparison', getForestComparison);

export default router;