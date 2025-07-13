import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

// File type validation
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and HEIC images are allowed.'), false);
  }
  
  cb(null, true);
};

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
    
    try {
      await fs.access(uploadDir);
    } catch (error) {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files per request
  }
});

// Image processing utility
export const processImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 1200,
    height = 800,
    quality = 85,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

// Generate thumbnail
export const generateThumbnail = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(300, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 75 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};

// Clean up temporary files
export const cleanupTempFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Failed to cleanup temp file:', error);
  }
};

// Validate image file
export const validateImageFile = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    
    // Check image dimensions
    if (metadata.width > 5000 || metadata.height > 5000) {
      throw new Error('Image dimensions too large (max 5000x5000 pixels)');
    }
    
    if (metadata.width < 100 || metadata.height < 100) {
      throw new Error('Image dimensions too small (min 100x100 pixels)');
    }
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    throw new Error(`Image validation failed: ${error.message}`);
  }
};

// Upload error handler middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.',
          error: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 files allowed.',
          error: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field.',
          error: 'UNEXPECTED_FILE'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error.',
          error: error.code
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};