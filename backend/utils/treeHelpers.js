// Tree-specific utility functions for controllers and services

import { validationResult } from 'express-validator';
import { Forest } from '../models/index.js';
import { 
  handleControllerError, 
  sendSuccessResponse, 
  sendNotFoundResponse, 
  sendValidationErrorResponse,
  buildPaginationResponse 
} from './dashboardUtils.js';

/**
 * Handle validation errors for tree operations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} True if validation failed, false if passed
 */
export const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendValidationErrorResponse(res, errors.array());
    return true;
  }
  return false;
};

/**
 * Verify forest exists and is active
 * @param {string} forestId - Forest ID to verify
 * @returns {Promise<Object|null>} Forest object if exists and active, null otherwise
 */
export const verifyForestExists = async (forestId) => {
  const forest = await Forest.findById(forestId);
  return (forest && forest.isActive) ? forest : null;
};

/**
 * Transform tree data for mapping display
 * @param {Array} trees - Array of tree documents
 * @returns {Array} Array of transformed tree markers
 */
export const transformTreesForMapping = (trees) => {
  return trees.map(tree => ({
    id: tree._id,
    treeId: tree.treeId,
    coordinates: tree.location.coordinates,
    species: tree.species,
    currentHeight: tree.currentHeight,
    currentHealthStatus: tree.currentHealthStatus,
    measurementCount: tree.measurements.length
  }));
};

/**
 * Create measurement data object for tree
 * @param {Object} measurementBody - Request body with measurement data
 * @param {string} userId - ID of user taking measurement
 * @returns {Object} Formatted measurement object
 */
export const createMeasurementData = (measurementBody, userId) => {
  return {
    ...measurementBody,
    measuredBy: userId,
    measuredAt: new Date()
  };
};

/**
 * Handle tree operation errors consistently
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} operation - Operation that failed (e.g., 'Get trees')
 */
export const handleTreeError = (res, error, operation) => {
  handleControllerError(res, error, `${operation} error`);
};

/**
 * Send tree response with pagination
 * @param {Object} res - Express response object
 * @param {Array} trees - Tree data
 * @param {number} totalCount - Total count of trees
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Optional success message
 */
export const sendTreeListResponse = (res, trees, totalCount, page, limit, message = null) => {
  const data = {
    trees,
    pagination: buildPaginationResponse(totalCount, page, limit)
  };
  
  sendSuccessResponse(res, data, message);
};

/**
 * Send single tree response
 * @param {Object} res - Express response object
 * @param {Object} tree - Tree data
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code
 */
export const sendTreeResponse = (res, tree, message = null, statusCode = 200) => {
  sendSuccessResponse(res, { tree }, message, statusCode);
};

/**
 * Send tree mapping response
 * @param {Object} res - Express response object
 * @param {Object} forest - Forest data
 * @param {Array} trees - Transformed tree markers
 */
export const sendTreeMappingResponse = (res, forest, trees) => {
  const data = {
    forest: {
      id: forest._id,
      name: forest.name,
      region: forest.region
    },
    trees,
    totalCount: trees.length
  };
  
  sendSuccessResponse(res, data);
};

/**
 * Send measurement response
 * @param {Object} res - Express response object
 * @param {Object} tree - Updated tree with measurements
 * @param {string} message - Success message
 */
export const sendMeasurementResponse = (res, tree, message = 'Measurement added successfully') => {
  const data = {
    tree,
    latestMeasurement: tree.measurements[tree.measurements.length - 1]
  };
  
  sendSuccessResponse(res, data, message, 201);
};

/**
 * Send tree measurements history response
 * @param {Object} res - Express response object
 * @param {string} treeId - Tree ID
 * @param {Array} measurements - Measurements array
 */
export const sendMeasurementsHistoryResponse = (res, treeId, measurements) => {
  const data = {
    treeId,
    measurements
  };
  
  sendSuccessResponse(res, data);
};