// Dashboard utility functions for query building, aggregation, and calculations
import mongoose from 'mongoose';

/**
 * Safely convert string ID to ObjectId
 * @param {string} id - String ID to convert
 * @returns {mongoose.Types.ObjectId|null} ObjectId or null if invalid
 */
const toObjectId = (id) => {
  if (!id || typeof id !== 'string') return null;
  try {
    return new mongoose.Types.ObjectId(id.trim());
  } catch (error) {
    console.warn('Invalid ObjectId format:', id);
    return null;
  }
};

/**
 * Build query conditions for tree filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.forestId - Forest ID filter (single)
 * @param {string} filters.forestIds - Forest IDs filter (comma-separated)
 * @param {string} filters.species - Species filter (regex)
 * @param {string} filters.isAlive - Alive status filter
 * @param {string} filters.startDate - Start date filter
 * @param {string} filters.endDate - End date filter
 * @returns {Object} Query conditions for trees
 */
export const buildTreeQuery = (filters = {}) => {
  const { forestId, forestIds, species, isAlive, startDate, endDate } = filters;
  const query = {};

  // Handle both single forestId and multiple forestIds
  if (forestIds) {
    // Multiple forests selected (comma-separated string)
    const forestIdArray = forestIds.split(',')
      .map(id => toObjectId(id))
      .filter(id => id !== null); // Remove invalid IDs
    
    if (forestIdArray.length > 0) {
      query.forestId = { $in: forestIdArray };
    }
  } else if (forestId) {
    // Single forest selected
    const objectId = toObjectId(forestId);
    if (objectId) {
      query.forestId = objectId;
    }
  }

  if (species) {
    query.species = new RegExp(species, 'i');
  }

  if (isAlive !== undefined) {
    query.isAlive = isAlive === 'true';
  }

  if (startDate || endDate) {
    query.plantedDate = {};
    if (startDate) query.plantedDate.$gte = new Date(startDate);
    if (endDate) query.plantedDate.$lte = new Date(endDate);
  }

  return query;
};

/**
 * Build query conditions for forest filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.forestId - Forest ID filter
 * @param {string} filters.region - Region filter (regex)
 * @param {string} filters.startDate - Start date filter for establishedDate
 * @param {string} filters.endDate - End date filter for establishedDate
 * @returns {Object} Query conditions for forests
 */
export const buildForestQuery = (filters = {}) => {
  const { forestId, region, startDate, endDate } = filters;
  const query = { isActive: true };

  if (forestId) {
    const objectId = toObjectId(forestId);
    if (objectId) {
      query._id = objectId;
    }
  }

  if (region) {
    query.region = new RegExp(region, 'i');
  }

  if (startDate || endDate) {
    query.establishedDate = {};
    if (startDate) query.establishedDate.$gte = new Date(startDate);
    if (endDate) query.establishedDate.$lte = new Date(endDate);
  }

  return query;
};

/**
 * Build pagination options for database queries
 * @param {Object} params - Pagination parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.sortBy - Field to sort by (default: 'name')
 * @param {string} params.sortOrder - Sort direction: 'asc' or 'desc' (default: 'asc')
 * @returns {Object} Pagination options with skip, limit, and sort
 */
export const buildPaginationOptions = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc'
  } = params;

  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  return {
    skip,
    limit: parseInt(limit),
    sort: { [sortBy]: sortDirection },
    pagination: {
      currentPage: parseInt(page),
      limit: parseInt(limit)
    }
  };
};

/**
 * Build pagination response metadata
 * @param {number} totalCount - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const buildPaginationResponse = (totalCount, page, limit) => {
  return {
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    hasNextPage: page * limit < totalCount,
    hasPrevPage: page > 1
  };
};

/**
 * Round number to 2 decimal places
 * @param {number} value - Number to round
 * @returns {number} Rounded number
 */
export const roundToTwo = (value) => {
  return Math.round(value * 100) / 100;
};

/**
 * Calculate survival rate percentage
 * @param {number} alive - Number of alive trees
 * @param {number} total - Total number of trees
 * @returns {number} Survival rate as percentage (0-100)
 */
export const calculateSurvivalRate = (alive, total) => {
  return total > 0 ? (alive / total) * 100 : 0;
};

/**
 * Calculate tree density (trees per hectare)
 * @param {number} trees - Number of trees
 * @param {number} area - Area in hectares
 * @returns {number} Tree density
 */
export const calculateTreeDensity = (trees, area) => {
  return area > 0 ? trees / area : 0;
};

/**
 * Get date filter for recent activity (last N days)
 * @param {number} days - Number of days back
 * @returns {Date} Date object for filtering
 */
export const getRecentDateFilter = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Standard error response for dashboard endpoints
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} message - User-friendly error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const handleDashboardError = (res, error, message, statusCode = 500) => {
  console.error(`Dashboard error: ${message}`, error);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * Standard error response for controller endpoints
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} context - Context of the error (e.g., 'Get forests error')
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const handleControllerError = (res, error, context, statusCode = 500) => {
  console.error(`${context}:`, error);
  res.status(statusCode).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * Standard success response helper
 * @param {Object} res - Express response object
 * @param {Object|Array} data - Response data
 * @param {string} message - Success message (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccessResponse = (res, data, message = null, statusCode = 200) => {
  const response = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Standard not found response helper
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource that wasn't found
 */
export const sendNotFoundResponse = (res, resource = 'Resource') => {
  res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
};

/**
 * Standard validation error response helper
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationErrorResponse = (res, errors) => {
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};