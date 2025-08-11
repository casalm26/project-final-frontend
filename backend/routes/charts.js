import express from 'express';
import {
  getSurvivalRateChart,
  getHeightGrowthChart,
  getCO2AbsorptionChart,
  getHealthStatusChart,
  getCombinedChartData
} from '../controllers/chartController.js';
import { authenticateToken } from '../middleware/auth.js';
// import { dataLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All chart routes require authentication
router.use(authenticateToken);

// Rate limiting disabled for development
// router.use(dataLimiter);

/**
 * @swagger
 * components:
 *   schemas:
 *     ChartDataPoint:
 *       type: object
 *       properties:
 *         period:
 *           type: string
 *           description: Time period (format depends on groupBy parameter)
 *         value:
 *           type: number
 *           description: Data value for this period
 */

/**
 * @swagger
 * /charts/survival-rate:
 *   get:
 *     summary: Get survival rate chart data over time
 *     tags: [Charts]
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for data range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for data range
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time grouping for data points
 *     responses:
 *       200:
 *         description: Survival rate chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                           totalPlanted:
 *                             type: integer
 *                           surviving:
 *                             type: integer
 *                           dead:
 *                             type: integer
 *                           survivalRate:
 *                             type: number
 *                             format: float
 *                     groupBy:
 *                       type: string
 *                     totalDataPoints:
 *                       type: integer
 */
router.get('/survival-rate', getSurvivalRateChart);

/**
 * @swagger
 * /charts/height-growth:
 *   get:
 *     summary: Get height growth chart data over time
 *     tags: [Charts]
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by tree species
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for data range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for data range
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Height growth chart data
 */
router.get('/height-growth', getHeightGrowthChart);

/**
 * @swagger
 * /charts/co2-absorption:
 *   get:
 *     summary: Get CO2 absorption chart data over time
 *     tags: [Charts]
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by tree species
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: CO2 absorption chart data with cumulative totals
 */
router.get('/co2-absorption', getCO2AbsorptionChart);

/**
 * @swagger
 * /charts/health-status:
 *   get:
 *     summary: Get tree health status distribution chart data
 *     tags: [Charts]
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Health status distribution chart data
 */
router.get('/health-status', getHealthStatusChart);

/**
 * @swagger
 * /charts/combined:
 *   get:
 *     summary: Get combined chart data for dashboard
 *     tags: [Charts]
 *     description: Returns all chart data types in a single response for dashboard widgets
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Combined chart data for all chart types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     survivalRate:
 *                       type: object
 *                       description: Survival rate chart data
 *                     heightGrowth:
 *                       type: object
 *                       description: Height growth chart data
 *                     co2Absorption:
 *                       type: object
 *                       description: CO2 absorption chart data
 *                     healthStatus:
 *                       type: object
 *                       description: Health status chart data
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 */
router.get('/combined', getCombinedChartData);

export default router;