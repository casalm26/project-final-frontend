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

// Upload images for a tree
export const uploadTreeImages = async (req, res) => {
  try {
    const { treeId } = req.params;
    const { description, imageType = 'tree_photo', tags } = req.body;
    
    // Validate tree exists
    const tree = await Tree.findById(treeId);
    if (!tree) {
      // Clean up uploaded files
      if (req.files) {
        for (const file of req.files) {
          await cleanupTempFile(file.path);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedImages = [];
    const uploadDir = path.join(process.cwd(), 'uploads', 'trees');
    const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');

    // Ensure upload directories exist
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    for (const file of req.files) {
      try {
        // Validate image
        const imageMetadata = await validateImageFile(file.path);
        
        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `tree-${treeId}-${timestamp}-${random}${ext}`;
        const thumbnailFilename = `thumb-${filename}`;
        
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

        // Save to database
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
          uploadedBy: req.user._id,
          capturedAt: new Date()
        });

        await treeImage.save();
        uploadedImages.push(treeImage.toPublicJSON());

        // Clean up temp file
        await cleanupTempFile(file.path);

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        
        // Clean up temp file
        await cleanupTempFile(file.path);
        
        // Continue with other files
        continue;
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images were successfully processed'
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
      data: {
        images: uploadedImages,
        treeId,
        uploadCount: uploadedImages.length
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up any uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        await cleanupTempFile(file.path);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get images for a tree
export const getTreeImages = async (req, res) => {
  try {
    const { treeId } = req.params;
    const { 
      imageType, 
      page = 1, 
      limit = 20,
      sortBy = '-capturedAt'
    } = req.query;

    // Validate tree exists
    const tree = await Tree.findById(treeId);
    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    const options = {
      imageType,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy
    };

    const images = await TreeImage.findByTree(treeId, options);
    const totalImages = await TreeImage.countDocuments({ 
      treeId, 
      isActive: true,
      ...(imageType && { imageType })
    });

    res.json({
      success: true,
      data: {
        images: images.map(img => img.toPublicJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalImages,
          pages: Math.ceil(totalImages / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get tree images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tree images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single image details
export const getImageDetails = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await TreeImage.findById(imageId)
      .populate('treeId', 'species plantedDate forestId')
      .populate('uploadedBy', 'firstName lastName email');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      data: image.toPublicJSON()
    });

  } catch (error) {
    console.error('Get image details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve image details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update image metadata
export const updateImageMetadata = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { description, imageType, tags } = req.body;

    const image = await TreeImage.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Check if user owns the image or is admin
    if (image.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this image'
      });
    }

    // Update fields
    if (description !== undefined) image.description = description;
    if (imageType !== undefined) image.imageType = imageType;
    if (tags !== undefined) image.tags = tags.split(',').map(tag => tag.trim());

    await image.save();

    res.json({
      success: true,
      message: 'Image metadata updated successfully',
      data: image.toPublicJSON()
    });

  } catch (error) {
    console.error('Update image metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image metadata',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await TreeImage.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Check if user owns the image or is admin
    if (image.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this image'
      });
    }

    // Soft delete - mark as inactive
    image.isActive = false;
    await image.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get image statistics for a tree
export const getTreeImageStats = async (req, res) => {
  try {
    const { treeId } = req.params;

    // Validate tree exists
    const tree = await Tree.findById(treeId);
    if (!tree) {
      return res.status(404).json({
        success: false,
        message: 'Tree not found'
      });
    }

    const stats = await TreeImage.getImageStats(treeId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get tree image stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve image statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get recent images across all trees
export const getRecentImages = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const images = await TreeImage.findRecent(parseInt(limit));

    res.json({
      success: true,
      data: {
        images: images.map(img => img.toPublicJSON()),
        count: images.length
      }
    });

  } catch (error) {
    console.error('Get recent images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};