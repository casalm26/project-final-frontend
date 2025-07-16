import TreeImage from '../models/TreeImage.js';
import {
  validateTreeExists,
  validateImageOwnership,
  cleanupUploadedFiles,
  processSingleImageUpload,
  buildPaginationOptions,
  buildPaginationResponse
} from '../utils/uploadHelpers.js';
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendNotFoundResponse,
  sendUnauthorizedResponse,
  sendBadRequestResponse
} from '../utils/responseHelpers.js';

// Upload images for a tree
export const uploadTreeImages = async (req, res) => {
  try {
    const { treeId } = req.params;
    const { description, imageType = 'tree_photo', tags } = req.body;
    
    // Validate tree exists
    const tree = await validateTreeExists(treeId);
    if (!tree) {
      await cleanupUploadedFiles(req.files);
      return sendNotFoundResponse(res, 'Tree');
    }

    if (!req.files || req.files.length === 0) {
      return sendBadRequestResponse(res, 'No files uploaded');
    }

    const uploadedImages = [];
    const uploadOptions = {
      description,
      imageType,
      tags,
      uploadedBy: req.user._id
    };

    for (const file of req.files) {
      try {
        const processedImage = await processSingleImageUpload(file, treeId, uploadOptions);
        uploadedImages.push(processedImage);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        // Continue with other files
        continue;
      }
    }

    if (uploadedImages.length === 0) {
      return sendBadRequestResponse(res, 'No images were successfully processed');
    }

    const responseData = {
      images: uploadedImages,
      treeId,
      uploadCount: uploadedImages.length
    };

    sendSuccessResponse(res, responseData, `Successfully uploaded ${uploadedImages.length} image(s)`, 201);

  } catch (error) {
    console.error('Upload error:', error);
    await cleanupUploadedFiles(req.files);
    sendErrorResponse(res, 'Image upload failed', 500, error.message);
  }
};

// Get images for a tree
export const getTreeImages = async (req, res) => {
  try {
    const { treeId } = req.params;

    // Validate tree exists
    const tree = await validateTreeExists(treeId);
    if (!tree) {
      return sendNotFoundResponse(res, 'Tree');
    }

    const options = buildPaginationOptions(req.query);
    const { imageType, page = 1, limit = 20 } = req.query;

    const images = await TreeImage.findByTree(treeId, options);
    const totalImages = await TreeImage.countDocuments({ 
      treeId, 
      isActive: true,
      ...(imageType && { imageType })
    });

    const responseData = {
      images: images.map(img => img.toPublicJSON()),
      pagination: buildPaginationResponse(page, limit, totalImages)
    };

    sendSuccessResponse(res, responseData);

  } catch (error) {
    console.error('Get tree images error:', error);
    sendErrorResponse(res, 'Failed to retrieve tree images', 500, error.message);
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
      return sendNotFoundResponse(res, 'Image');
    }

    sendSuccessResponse(res, image.toPublicJSON());

  } catch (error) {
    console.error('Get image details error:', error);
    sendErrorResponse(res, 'Failed to retrieve image details', 500, error.message);
  }
};

// Update image metadata
export const updateImageMetadata = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { description, imageType, tags } = req.body;

    const image = await TreeImage.findById(imageId);
    if (!image) {
      return sendNotFoundResponse(res, 'Image');
    }

    // Check if user owns the image or is admin
    if (!validateImageOwnership(image, req.user)) {
      return sendUnauthorizedResponse(res, 'Not authorized to update this image');
    }

    // Update fields
    if (description !== undefined) image.description = description;
    if (imageType !== undefined) image.imageType = imageType;
    if (tags !== undefined) image.tags = tags.split(',').map(tag => tag.trim());

    await image.save();

    sendSuccessResponse(res, image.toPublicJSON(), 'Image metadata updated successfully');

  } catch (error) {
    console.error('Update image metadata error:', error);
    sendErrorResponse(res, 'Failed to update image metadata', 500, error.message);
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await TreeImage.findById(imageId);
    if (!image) {
      return sendNotFoundResponse(res, 'Image');
    }

    // Check if user owns the image or is admin
    if (!validateImageOwnership(image, req.user)) {
      return sendUnauthorizedResponse(res, 'Not authorized to delete this image');
    }

    // Soft delete - mark as inactive
    image.isActive = false;
    await image.save();

    sendSuccessResponse(res, null, 'Image deleted successfully');

  } catch (error) {
    console.error('Delete image error:', error);
    sendErrorResponse(res, 'Failed to delete image', 500, error.message);
  }
};

// Get image statistics for a tree
export const getTreeImageStats = async (req, res) => {
  try {
    const { treeId } = req.params;

    // Validate tree exists
    const tree = await validateTreeExists(treeId);
    if (!tree) {
      return sendNotFoundResponse(res, 'Tree');
    }

    const stats = await TreeImage.getImageStats(treeId);

    sendSuccessResponse(res, stats);

  } catch (error) {
    console.error('Get tree image stats error:', error);
    sendErrorResponse(res, 'Failed to retrieve image statistics', 500, error.message);
  }
};

// Get recent images across all trees
export const getRecentImages = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const images = await TreeImage.findRecent(parseInt(limit));

    const responseData = {
      images: images.map(img => img.toPublicJSON()),
      count: images.length
    };

    sendSuccessResponse(res, responseData);

  } catch (error) {
    console.error('Get recent images error:', error);
    sendErrorResponse(res, 'Failed to retrieve recent images', 500, error.message);
  }
};