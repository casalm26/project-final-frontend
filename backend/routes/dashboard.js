import express from 'express';
import {
  getDashboardStats,
  getQuickStats,
  getForestComparison,
  getEnhancedDashboardStats
} from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';
// import { dataLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Rate limiting disabled for development
// router.use(dataLimiter);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics
 *     tags: [Dashboard]
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
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by tree species
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                     trees:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         alive:
 *                           type: integer
 *                         dead:
 *                           type: integer
 *                         survivalRate:
 *                           type: number
 *                           format: float
 *                     forests:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         totalArea:
 *                           type: number
 *                           format: float
 *                     users:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                     growth:
 *                       type: object
 *                       properties:
 *                         avgHeight:
 *                           type: number
 *                           format: float
 *                         avgDiameter:
 *                           type: number
 *                           format: float
 *                         totalCO2Absorbed:
 *                           type: number
 *                           format: float
 *       401:
 *         description: Authentication required
 *       429:
 *         description: Too many requests
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /dashboard/quick-stats:
 *   get:
 *     summary: Get quick dashboard statistics for widgets
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Quick stats retrieved successfully
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
 *                     totalTrees:
 *                       type: integer
 *                     totalForests:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     survivalRate:
 *                       type: number
 *                       format: float
 */
router.get('/quick-stats', getQuickStats);

/**
 * @swagger
 * /dashboard/forest-comparison:
 *   get:
 *     summary: Get forest comparison data
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit number of forests to compare
 *     responses:
 *       200:
 *         description: Forest comparison data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       treeCount:
 *                         type: integer
 *                       survivalRate:
 *                         type: number
 *                         format: float
 *                       avgHeight:
 *                         type: number
 *                         format: float
 *                       area:
 *                         type: number
 *                         format: float
 */
router.get('/forest-comparison', getForestComparison);

/**
 * @swagger
 * /dashboard/enhanced-stats:
 *   get:
 *     summary: Get enhanced dashboard statistics with simulated financial and ecological data
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: forestId
 *         schema:
 *           type: string
 *         description: Filter by specific forest ID
 *       - in: query
 *         name: forestIds
 *         schema:
 *           type: string
 *         description: Filter by multiple forest IDs (comma-separated)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by tree species
 *       - in: query
 *         name: isAlive
 *         schema:
 *           type: boolean
 *         description: Filter by tree alive status
 *     responses:
 *       200:
 *         description: Enhanced dashboard statistics with simulations
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
 *                     basic:
 *                       type: object
 *                       properties:
 *                         totalTrees:
 *                           type: integer
 *                         aliveTrees:
 *                           type: integer
 *                         survivalRate:
 *                           type: number
 *                           format: float
 *                     investor:
 *                       type: object
 *                       description: Simulated financial metrics
 *                     ecological:
 *                       type: object
 *                       description: Simulated ecological metrics
 */
router.get('/enhanced-stats', getEnhancedDashboardStats);

export default router;