import path from 'path';
import fs from 'fs/promises';
import { Tree } from '../models/index.js';
import TreeImage from '../models/TreeImage.js';
import { 
  processImage, 
  generateThumbnail, 
  cleanupTempFile, 
  validateImageFile 
} from '../middleware/upload.js';

/**
 * Validates if a tree exists by ID
 * @param {string} treeId - The tree ID to validate
 * @returns {Promise<Object|null>} - Tree object if found, null if not found
 */
export const validateTreeExists = async (treeId) => {
  try {
    const tree = await Tree.findById(treeId);
    return tree;
  } catch (error) {
    return null;
  }
};

/**
 * Validates user authorization for image operations
 * @param {Object} image - The image object
 * @param {Object} user - The user object from request
 * @returns {boolean} - True if user is authorized
 */
export const validateImageOwnership = (image, user) => {
  return image.uploadedBy.toString() === user._id.toString() || user.role === 'admin';
};

/**
 * Cleans up uploaded files array
 * @param {Array} files - Array of file objects
 */
export const cleanupUploadedFiles = async (files) => {
  if (!files) return;
  
  for (const file of files) {
    await cleanupTempFile(file.path);
  }
};

/**
 * Generates unique filename for tree image
 * @param {string} treeId - The tree ID
 * @param {string} originalName - Original filename
 * @returns {Object} - Object with filename and thumbnailFilename
 */
export const generateImageFilenames = (treeId, originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const ext = path.extname(originalName).toLowerCase();
  const filename = `tree-${treeId}-${timestamp}-${random}${ext}`;
  const thumbnailFilename = `thumb-${filename}`;
  
  return { filename, thumbnailFilename };
};

/**
 * Ensures upload directories exist
 * @returns {Promise<Object>} - Object with upload and thumbnail directory paths
 */
export const ensureUploadDirectories = async () => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'trees');
  const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.mkdir(thumbnailDir, { recursive: true });

  return { uploadDir, thumbnailDir };
};

/**
 * Processes a single image file upload
 * @param {Object} file - File object from multer
 * @param {string} treeId - Tree ID
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Processed image data
 */
export const processSingleImageUpload = async (file, treeId, options = {}) => {
  const {
    description,
    imageType = 'tree_photo',
    tags,
    uploadedBy
  } = options;

  // Validate image
  const imageMetadata = await validateImageFile(file.path);
  
  // Generate filenames
  const { filename, thumbnailFilename } = generateImageFilenames(treeId, file.originalname);
  
  // Ensure directories exist
  const { uploadDir, thumbnailDir } = await ensureUploadDirectories();
  
  const finalPath = path.join(uploadDir, filename);
  const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

  // Process and save main image
  await processImage(file.path, finalPath, {
    width: 1200,
    height: 800,
    quality: 85
  });

  // Generate thumbnail
  await generateThumbnail(file.path, thumbnailPath);

  // Create TreeImage document
  const treeImage = new TreeImage({
    treeId,
    filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: finalPath,
    thumbnailPath,
    metadata: imageMetadata,
    imageType,
    description,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    uploadedBy,
    capturedAt: new Date()
  });

  await treeImage.save();
  
  // Clean up temp file
  await cleanupTempFile(file.path);

  return treeImage.toPublicJSON();
};

/**
 * Builds pagination query options
 * @param {Object} query - Request query parameters
 * @returns {Object} - Formatted options for database query
 */
export const buildPaginationOptions = (query) => {
  const { 
    imageType, 
    page = 1, 
    limit = 20,
    sortBy = '-capturedAt'
  } = query;

  return {
    imageType,
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    sortBy
  };
};

/**
 * Builds pagination response data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} - Pagination metadata
 */
export const buildPaginationResponse = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / parseInt(limit))
  };
};