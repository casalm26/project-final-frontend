/**
 * Validation helper utilities for user operations
 */

import { validationResult } from 'express-validator';
import { sendBadRequestResponse } from './responseHelpers.js';

/**
 * Checks validation results and sends error response if validation fails
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} - Returns true if validation passed, false if failed
 */
export const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return false;
  }
  return true;
};

/**
 * Validates if user can perform action on themselves
 * @param {string} currentUserId - ID of the current user
 * @param {string} targetUserId - ID of the target user
 * @param {string} action - Action being performed
 * @returns {Object|null} - Returns error object if validation fails, null if passes
 */
export const validateSelfAction = (currentUserId, targetUserId, action) => {
  if (currentUserId === targetUserId) {
    return {
      success: false,
      message: `You cannot ${action} your own account`
    };
  }
  return null;
};