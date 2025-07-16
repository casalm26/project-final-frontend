import express from 'express';
import {
  bulkCreateTrees,
  bulkUpdateTrees,
  bulkDeleteTrees,
  bulkAddMeasurements,
  getBulkOperationStatus
} from '../controllers/bulkController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
// import { dataLimiter } from '../middleware/rateLimiter.js'; // TEMPORARILY DISABLED FOR DEVELOPMENT
import { emitUserActivity } from '../middleware/realtimeEvents.js';

const router = express.Router();

// All bulk routes require authentication
router.use(authenticateToken);

// Apply rate limiting - TEMPORARILY DISABLED FOR DEVELOPMENT
// router.use(dataLimiter);

// Apply user activity tracking
router.use(emitUserActivity);

/**
 * @swagger
 * components:
 *   schemas:
 *     BulkTreeCreate:
 *       type: object
 *       required:
 *         - trees
 *       properties:
 *         trees:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - species
 *               - location
 *             properties:
 *               species:
 *                 type: string
 *               forestId:
 *                 type: string
 *               plantedDate:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *               isAlive:
 *                 type: boolean
 *                 default: true
 *         forestId:
 *           type: string
 *           description: Default forest ID for all trees if not specified individually
 *         skipValidation:
 *           type: boolean
 *           default: false
 *           description: Skip validation for faster processing (admin only)
 *     
 *     BulkOperationResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             summary:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 affectedCount:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /bulk/trees/create:
 *   post:
 *     summary: Bulk create trees
 *     tags: [Bulk Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkTreeCreate'
 *           example:
 *             forestId: "507f1f77bcf86cd799439011"
 *             trees:
 *               - species: "Oak"
 *                 location:
 *                   type: "Point"
 *                   coordinates: [18.0686, 59.3293]
 *                 plantedDate: "2024-01-15"
 *               - species: "Pine"
 *                 location:
 *                   type: "Point"
 *                   coordinates: [18.0687, 59.3294]
 *                 plantedDate: "2024-01-15"
 *     responses:
 *       201:
 *         description: Trees created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkOperationResult'
 *       400:
 *         description: Validation errors or invalid request
 *       404:
 *         description: Forest not found
 *       413:
 *         description: Too many trees (max 1000)
 */
router.post('/trees/create', bulkCreateTrees);

/**
 * @swagger
 * /bulk/trees/update:
 *   put:
 *     summary: Bulk update trees
 *     tags: [Bulk Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updates
 *             properties:
 *               treeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tree IDs to update (alternative to filter)
 *               filter:
 *                 type: object
 *                 description: Filter criteria to select trees (alternative to treeIds)
 *                 properties:
 *                   forestId:
 *                     type: string
 *                   species:
 *                     type: string
 *                   isAlive:
 *                     type: boolean
 *                   plantedBefore:
 *                     type: string
 *                     format: date
 *                   plantedAfter:
 *                     type: string
 *                     format: date
 *               updates:
 *                 type: object
 *                 description: Fields to update
 *                 properties:
 *                   species:
 *                     type: string
 *                   isAlive:
 *                     type: boolean
 *                   addMeasurement:
 *                     type: object
 *                     description: Add a new measurement to all selected trees
 *                     properties:
 *                       height:
 *                         type: number
 *                       diameter:
 *                         type: number
 *                       healthStatus:
 *                         type: string
 *                         enum: [healthy, stressed, diseased, dead]
 *                       co2Absorption:
 *                         type: number
 *                       notes:
 *                         type: string
 *           example:
 *             filter:
 *               forestId: "507f1f77bcf86cd799439011"
 *               species: "Oak"
 *             updates:
 *               addMeasurement:
 *                 height: 2.5
 *                 diameter: 0.15
 *                 healthStatus: "healthy"
 *                 co2Absorption: 12.5
 *                 notes: "Monthly measurement"
 *     responses:
 *       200:
 *         description: Trees updated successfully
 *       400:
 *         description: Invalid request or too many trees
 *       404:
 *         description: No trees found matching criteria
 */
router.put('/trees/update', bulkUpdateTrees);

/**
 * @swagger
 * /bulk/trees/delete:
 *   delete:
 *     summary: Bulk delete trees (soft delete by default)
 *     tags: [Bulk Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tree IDs to delete
 *               filter:
 *                 type: object
 *                 description: Filter criteria to select trees for deletion
 *                 properties:
 *                   forestId:
 *                     type: string
 *                   species:
 *                     type: string
 *                   isAlive:
 *                     type: boolean
 *                   plantedBefore:
 *                     type: string
 *                     format: date
 *               hardDelete:
 *                 type: boolean
 *                 default: false
 *                 description: Permanently delete trees (admin only)
 *           example:
 *             filter:
 *               isAlive: false
 *               plantedBefore: "2020-01-01"
 *             hardDelete: false
 *     responses:
 *       200:
 *         description: Trees deleted successfully
 *       400:
 *         description: Invalid request or too many trees
 *       403:
 *         description: Hard delete requires admin privileges
 *       404:
 *         description: No trees found matching criteria
 */
router.delete('/trees/delete', bulkDeleteTrees);

/**
 * @swagger
 * /bulk/measurements/add:
 *   post:
 *     summary: Bulk add measurements to multiple trees
 *     tags: [Bulk Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - measurements
 *             properties:
 *               measurements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - treeId
 *                   properties:
 *                     treeId:
 *                       type: string
 *                     height:
 *                       type: number
 *                       description: Height in meters
 *                     diameter:
 *                       type: number
 *                       description: Diameter in meters
 *                     healthStatus:
 *                       type: string
 *                       enum: [healthy, stressed, diseased, dead]
 *                     co2Absorption:
 *                       type: number
 *                       description: CO2 absorption in kg
 *                     measuredAt:
 *                       type: string
 *                       format: date-time
 *                       description: Measurement timestamp (defaults to now)
 *                     notes:
 *                       type: string
 *           example:
 *             measurements:
 *               - treeId: "507f1f77bcf86cd799439011"
 *                 height: 2.5
 *                 diameter: 0.15
 *                 healthStatus: "healthy"
 *                 co2Absorption: 12.5
 *                 notes: "Monthly measurement"
 *               - treeId: "507f1f77bcf86cd799439012"
 *                 height: 3.2
 *                 diameter: 0.18
 *                 healthStatus: "healthy"
 *                 co2Absorption: 15.8
 *     responses:
 *       201:
 *         description: Measurements added successfully
 *       400:
 *         description: Validation errors or invalid request
 *       404:
 *         description: Some trees not found or inactive
 */
router.post('/measurements/add', bulkAddMeasurements);

/**
 * @swagger
 * /bulk/operations/status:
 *   get:
 *     summary: Get bulk operation status and history
 *     tags: [Bulk Operations]
 *     description: Returns recent bulk operations and statistics (last 24 hours)
 *     responses:
 *       200:
 *         description: Bulk operation status retrieved successfully
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
 *                     recentOperations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           action:
 *                             type: string
 *                           resource:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           user:
 *                             type: object
 *                             properties:
 *                               email:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                           changes:
 *                             type: object
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         byOperation:
 *                           type: object
 *                         byUser:
 *                           type: object
 *                         last24Hours:
 *                           type: integer
 */
router.get('/operations/status', getBulkOperationStatus);

export default router;