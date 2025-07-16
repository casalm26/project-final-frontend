// Utility functions for audit logging functionality

/**
 * Determines the audit action based on HTTP method and request path
 * @param {string} method - HTTP method (POST, PUT, PATCH, DELETE)
 * @param {number} statusCode - HTTP response status code
 * @param {string} path - Request path
 * @returns {string|null} - Action type or null if no action should be logged
 */
export const getActionFromRequest = (method, statusCode, path) => {
  switch (method) {
    case 'POST':
      if (path.includes('/login')) return 'LOGIN';
      if (path.includes('/register')) return 'REGISTER';
      if (path.includes('/logout')) return 'LOGOUT';
      if (path.includes('/export')) return 'EXPORT';
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return null; // Don't log GET requests by default
  }
};

/**
 * Extracts resource ID from request parameters or response data
 * @param {Object} req - Express request object
 * @param {Object} responseData - Response data object
 * @returns {string|null} - Resource ID or null if not found
 */
export const getResourceId = (req, responseData) => {
  // Try to get ID from URL params
  if (req.params.id) {
    return req.params.id;
  }

  // Try to get ID from response data
  if (responseData?.data?.id) {
    return responseData.data.id;
  }

  if (responseData?.data?._id) {
    return responseData.data._id;
  }

  // For custom IDs like treeId
  if (responseData?.data?.treeId) {
    return responseData.data.treeId;
  }

  return null;
};

/**
 * Creates base audit log data structure
 * @param {Object} params - Parameters for creating log data
 * @returns {Object} - Base audit log data
 */
export const createBaseLogData = ({
  action,
  resource,
  resourceId,
  user,
  req,
  statusCode
}) => ({
  action,
  resource,
  resourceId,
  userId: user._id,
  userEmail: user.email,
  userRole: user.role,
  metadata: {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method,
    statusCode
  }
});

/**
 * Adds action-specific metadata to log data
 * @param {Object} logData - Base log data object
 * @param {string} action - Action type
 * @param {Object} req - Express request object
 * @param {number} statusCode - HTTP response status code
 * @returns {Object} - Enhanced log data with action-specific metadata
 */
export const addActionSpecificMetadata = (logData, action, req, statusCode) => {
  const enhancedLogData = { ...logData };

  switch (action) {
    case 'LOGIN':
      enhancedLogData.metadata.additionalInfo = {
        loginMethod: 'password',
        success: statusCode < 400
      };
      break;
    
    case 'REGISTER':
      enhancedLogData.metadata.additionalInfo = {
        newUserEmail: req.body.email,
        newUserRole: req.body.role || 'user'
      };
      break;
    
    case 'EXPORT':
      enhancedLogData.metadata.additionalInfo = {
        exportType: req.path.includes('csv') ? 'CSV' : 'XLSX',
        filters: req.query
      };
      break;
  }

  return enhancedLogData;
};

/**
 * Adds update-specific changes to log data
 * @param {Object} logData - Base log data object
 * @param {Object} originalDoc - Original document before changes
 * @param {Object} responseData - Response data with updated document
 * @returns {Object} - Enhanced log data with change tracking
 */
export const addUpdateChanges = (logData, originalDoc, responseData) => {
  const enhancedLogData = { ...logData };
  
  if (originalDoc) {
    enhancedLogData.changes = {
      before: originalDoc,
      after: responseData?.data
    };
  }

  return enhancedLogData;
};

/**
 * Adds request body to log data if capture is enabled
 * @param {Object} logData - Base log data object
 * @param {Object} req - Express request object
 * @param {boolean} captureBody - Whether to capture request body
 * @returns {Object} - Enhanced log data with request body if enabled
 */
export const addRequestBody = (logData, req, captureBody) => {
  const enhancedLogData = { ...logData };
  
  if (captureBody && req.body) {
    enhancedLogData.metadata.requestBody = req.body;
  }

  return enhancedLogData;
};

/**
 * Adds error information to log data for failed requests
 * @param {Object} logData - Base log data object
 * @param {number} statusCode - HTTP response status code
 * @param {Object} responseData - Response data object
 * @returns {Object} - Enhanced log data with error information
 */
export const addErrorInfo = (logData, statusCode, responseData) => {
  const enhancedLogData = { ...logData };
  
  if (statusCode >= 400) {
    enhancedLogData.metadata.errorMessage = responseData?.message || 'Unknown error';
  }

  return enhancedLogData;
};

/**
 * Determines if an audit log should be created based on conditions
 * @param {string|null} action - Action type
 * @param {number} statusCode - HTTP response status code
 * @returns {boolean} - Whether to create audit log
 */
export const shouldCreateAuditLog = (action, statusCode) => {
  return action && statusCode < 400;
};