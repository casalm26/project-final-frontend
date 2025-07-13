import express from 'express';
import {
  getSurvivalRateChart,
  getHeightGrowthChart,
  getCO2AbsorptionChart,
  getHealthStatusChart,
  getCombinedChartData
} from '../controllers/chartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { dataLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All chart routes require authentication
router.use(authenticateToken);

// Apply data rate limiting
router.use(dataLimiter);

// Individual chart data endpoints
router.get('/survival-rate', getSurvivalRateChart);
router.get('/height-growth', getHeightGrowthChart);
router.get('/co2-absorption', getCO2AbsorptionChart);
router.get('/health-status', getHealthStatusChart);

// Combined chart data for dashboard
router.get('/combined', getCombinedChartData);

export default router;