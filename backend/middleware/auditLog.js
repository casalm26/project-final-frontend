import { AuditLog } from '../models/index.js';
import {
  getActionFromRequest,
  getResourceId,
  createBaseLogData,
  addActionSpecificMetadata,
  addUpdateChanges,
  addRequestBody,
  addErrorInfo,
  shouldCreateAuditLog
} from '../utils/auditHelpers.js';

// Middleware to capture the original document before modification
export const captureOriginalDoc = (model) => {
  return async (req, res, next) => {
    if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      try {
        const { id } = req.params;
        if (id) {
          const originalDoc = await model.findById(id).lean();
          req.originalDoc = originalDoc;
        }
      } catch (error) {
        console.error('Error capturing original document:', error);
      }
    }
    next();
  };
};

// Main audit logging middleware
export const auditLog = (options = {}) => {
  const {
    resource,
    skipActions = [],
    captureBody = false,
    customExtractor = null
  } = options;

  return async (req, res, next) => {
    // Skip if user is not authenticated or action should be skipped
    if (!req.user || skipActions.includes(req.method)) {
      return next();
    }

    // Store original res.json to capture response
    const originalJson = res.json;
    let responseData = null;
    let statusCode = null;

    res.json = function(data) {
      responseData = data;
      statusCode = res.statusCode;
      return originalJson.call(this, data);
    };

    // Continue with request processing
    next();

    // After response is sent, log the audit trail
    res.on('finish', async () => {
      try {
        await logAuditTrail({
          req,
          res,
          resource,
          responseData,
          statusCode,
          captureBody,
          customExtractor
        });
      } catch (error) {
        console.error('Audit logging error:', error);
      }
    });
  };
};


// Main audit trail logging function
const logAuditTrail = async ({
  req,
  res,
  resource,
  responseData,
  statusCode,
  captureBody,
  customExtractor
}) => {
  const action = getActionFromRequest(req.method, statusCode, req.path);
  
  // Skip logging if no action determined or if it's a failed request
  if (!shouldCreateAuditLog(action, statusCode)) {
    return;
  }

  const resourceId = customExtractor ? 
    customExtractor(req, responseData) : 
    getResourceId(req, responseData);

  // Create base log data
  let logData = createBaseLogData({
    action,
    resource,
    resourceId,
    user: req.user,
    req,
    statusCode
  });

  // Add action-specific metadata
  logData = addActionSpecificMetadata(logData, action, req, statusCode);

  // Capture changes for UPDATE actions
  if (action === 'UPDATE') {
    logData = addUpdateChanges(logData, req.originalDoc, responseData);
  }

  // Capture request body if specified
  logData = addRequestBody(logData, req, captureBody);

  // Add error information for failed requests
  logData = addErrorInfo(logData, statusCode, responseData);

  await AuditLog.createLog(logData);
};

// Specific audit middleware for authentication events
export const auditAuth = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log authentication events
    if (req.user) {
      const action = getActionFromRequest(req.method, res.statusCode, req.path);
      
      if (action && ['LOGIN', 'REGISTER', 'LOGOUT'].includes(action)) {
        // Create base log data
        let logData = createBaseLogData({
          action,
          resource: 'User',
          resourceId: req.user._id,
          user: req.user,
          req,
          statusCode: res.statusCode
        });

        // Add action-specific metadata
        logData = addActionSpecificMetadata(logData, action, req, res.statusCode);

        AuditLog.createLog(logData).catch(err => console.error('Auth audit log error:', err));
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};