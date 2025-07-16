/**
 * Response helper utilities for consistent API responses
 */

/**
 * Response format constants
 */
const RESPONSE_FORMATS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

/**
 * HTTP status codes constants
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Base response structure builders
 */
const ResponseBuilder = {
  /**
   * Creates a success response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} - Formatted success response
   */
  success: (data, message = 'Success', statusCode = HTTP_STATUS.OK) => ({
    success: true,
    message,
    data,
    statusCode
  }),

  /**
   * Creates an error response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} error - Additional error details
   * @returns {Object} - Formatted error response
   */
  error: (message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, error = null) => {
    const response = {
      success: false,
      message,
      statusCode
    };

    if (process.env.NODE_ENV === 'development' && error) {
      response.error = error;
    }

    return response;
  }
};

/**
 * Legacy exports for backward compatibility
 */
export const createSuccessResponse = ResponseBuilder.success;
export const createErrorResponse = ResponseBuilder.error;

/**
 * Response senders
 */
const ResponseSender = {
  /**
   * Sends a success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  success: (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
    const response = ResponseBuilder.success(data, message, statusCode);
    res.status(statusCode).json(response);
  },

  /**
   * Sends an error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} error - Additional error details
   */
  error: (res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, error = null) => {
    const response = ResponseBuilder.error(message, statusCode, error);
    res.status(statusCode).json(response);
  }
};

/**
 * Main response functions
 */
export const sendSuccessResponse = ResponseSender.success;
export const sendErrorResponse = ResponseSender.error;

/**
 * Specialized response functions
 */
export const sendNotFoundResponse = (res, resource = 'Resource') => {
  ResponseSender.error(res, `${resource} not found`, HTTP_STATUS.NOT_FOUND);
};

export const sendUnauthorizedResponse = (res, message = 'Not authorized') => {
  ResponseSender.error(res, message, HTTP_STATUS.UNAUTHORIZED);
};

export const sendForbiddenResponse = (res, message = 'Forbidden') => {
  ResponseSender.error(res, message, HTTP_STATUS.FORBIDDEN);
};

export const sendBadRequestResponse = (res, message = 'Bad request') => {
  ResponseSender.error(res, message, HTTP_STATUS.BAD_REQUEST);
};

export const sendConflictResponse = (res, message = 'Conflict') => {
  ResponseSender.error(res, message, HTTP_STATUS.CONFLICT);
};

export const sendValidationErrorResponse = (res, errors, message = 'Validation failed') => {
  const response = {
    success: false,
    message,
    errors,
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY
  };
  res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
};

/**
 * Error handling utilities
 */
export const ErrorHandler = {
  /**
   * Handles async controller errors
   * @param {Function} fn - Async controller function
   * @returns {Function} - Wrapped controller function with error handling
   */
  asyncHandler: (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  /**
   * Handles controller errors with context logging
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   * @param {string} context - Context of the error
   * @param {number} statusCode - HTTP status code
   */
  handleControllerError: (res, error, context, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    console.error(`${context}:`, error);
    ResponseSender.error(res, 'Internal server error', statusCode, error);
  }
};

/**
 * Legacy exports for backward compatibility
 */
export const asyncHandler = ErrorHandler.asyncHandler;
export const handleControllerError = ErrorHandler.handleControllerError;

/**
 * Export constants for use in other modules
 */
export { HTTP_STATUS, RESPONSE_FORMATS };