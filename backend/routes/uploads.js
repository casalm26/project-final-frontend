import express from 'express';
import {
  uploadTreeImages,
  getTreeImages,
  getImageDetails,
  updateImageMetadata,
  deleteImage,
  getTreeImageStats,
  getRecentImages
} from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { dataLimiter } from '../middleware/rateLimiter.js';
import { emitImageUpload, emitUserActivity } from '../middleware/realtimeEvents.js';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateToken);

// Apply rate limiting
router.use(dataLimiter);

/**
 * @swagger
 * components:
 *   schemas:
 *     TreeImage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Image ID
 *         treeId:
 *           type: string
 *           description: Associated tree ID
 *         filename:
 *           type: string
 *           description: Stored filename
 *         originalName:
 *           type: string
 *           description: Original uploaded filename
 *         mimeType:
 *           type: string
 *           description: File MIME type
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         url:
 *           type: string
 *           description: Public URL to access image
 *         thumbnailUrl:
 *           type: string
 *           description: Thumbnail URL
 *         metadata:
 *           type: object
 *           properties:
 *             width:
 *               type: integer
 *             height:
 *               type: integer
 *             format:
 *               type: string
 *             hasAlpha:
 *               type: boolean
 *         imageType:
 *           type: string
 *           enum: [tree_photo, measurement_photo, health_assessment, general]
 *           description: Type of image
 *         description:
 *           type: string
 *           description: Image description
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Image tags
 *         capturedAt:
 *           type: string
 *           format: date-time
 *           description: When the photo was taken
 *         uploadedBy:
 *           type: string
 *           description: User who uploaded the image
 */

/**
 * @swagger
 * /uploads/trees/{treeId}/images:
 *   post:
 *     summary: Upload images for a tree
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: treeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tree ID to associate images with
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (max 5 files, 10MB each)
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Optional description for the images
 *               imageType:
 *                 type: string
 *                 enum: [tree_photo, measurement_photo, health_assessment, general]
 *                 default: tree_photo
 *                 description: Type of images being uploaded
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags for the images
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     images:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TreeImage'
 *                     treeId:
 *                       type: string
 *                     uploadCount:
 *                       type: integer
 *       400:
 *         description: Invalid file or request
 *       404:
 *         description: Tree not found
 *       413:
 *         description: File too large
 */
router.post('/trees/:treeId/images', 
  upload.array('images', 5), 
  handleUploadError,
  emitImageUpload,
  emitUserActivity,
  uploadTreeImages
);

/**
 * @swagger
 * /uploads/trees/{treeId}/images:
 *   get:
 *     summary: Get images for a tree
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: treeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tree ID
 *       - in: query
 *         name: imageType
 *         schema:
 *           type: string
 *           enum: [tree_photo, measurement_photo, health_assessment, general]
 *         description: Filter by image type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of images per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: -capturedAt
 *         description: Sort field and direction
 *     responses:
 *       200:
 *         description: Tree images retrieved successfully
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
 *                     images:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TreeImage'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 */
router.get('/trees/:treeId/images', getTreeImages);

/**
 * @swagger
 * /uploads/trees/{treeId}/images/stats:
 *   get:
 *     summary: Get image statistics for a tree
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: treeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tree ID
 *     responses:
 *       200:
 *         description: Image statistics retrieved successfully
 */
router.get('/trees/:treeId/images/stats', getTreeImageStats);

/**
 * @swagger
 * /uploads/images/recent:
 *   get:
 *     summary: Get recent images across all trees
 *     tags: [File Upload]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of recent images to retrieve
 *     responses:
 *       200:
 *         description: Recent images retrieved successfully
 */
router.get('/images/recent', getRecentImages);

/**
 * @swagger
 * /uploads/images/{imageId}:
 *   get:
 *     summary: Get image details
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image details retrieved successfully
 *       404:
 *         description: Image not found
 */
router.get('/images/:imageId', getImageDetails);

/**
 * @swagger
 * /uploads/images/{imageId}:
 *   put:
 *     summary: Update image metadata
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               imageType:
 *                 type: string
 *                 enum: [tree_photo, measurement_photo, health_assessment, general]
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *     responses:
 *       200:
 *         description: Image metadata updated successfully
 *       403:
 *         description: Not authorized to update this image
 *       404:
 *         description: Image not found
 */
router.put('/images/:imageId', updateImageMetadata);

/**
 * @swagger
 * /uploads/images/{imageId}:
 *   delete:
 *     summary: Delete an image
 *     tags: [File Upload]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       403:
 *         description: Not authorized to delete this image
 *       404:
 *         description: Image not found
 */
router.delete('/images/:imageId', deleteImage);

export default router;