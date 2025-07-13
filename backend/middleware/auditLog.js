import { AuditLog } from '../models/index.js';

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

// Function to determine action based on HTTP method and response
const getActionFromRequest = (method, statusCode, path) => {
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

// Function to extract resource ID from request
const getResourceId = (req, responseData) => {
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
  if (!action || statusCode >= 400) {
    return;
  }

  const resourceId = customExtractor ? 
    customExtractor(req, responseData) : 
    getResourceId(req, responseData);

  const logData = {
    action,
    resource,
    resourceId,
    userId: req.user._id,
    userEmail: req.user.email,
    userRole: req.user.role,
    metadata: {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      endpoint: req.originalUrl,
      method: req.method,
      statusCode
    }
  };

  // Capture changes for UPDATE actions
  if (action === 'UPDATE' && req.originalDoc) {
    logData.changes = {
      before: req.originalDoc,
      after: responseData?.data
    };
  }

  // Capture request body if specified
  if (captureBody && req.body) {
    logData.metadata.requestBody = req.body;
  }

  // Handle specific actions
  switch (action) {
    case 'LOGIN':
      logData.metadata.additionalInfo = {
        loginMethod: 'password',
        success: statusCode < 400
      };
      break;
    
    case 'REGISTER':
      logData.metadata.additionalInfo = {
        newUserEmail: req.body.email,
        newUserRole: req.body.role || 'user'
      };
      break;
    
    case 'EXPORT':
      logData.metadata.additionalInfo = {
        exportType: req.path.includes('csv') ? 'CSV' : 'XLSX',
        filters: req.query
      };
      break;
  }

  // Add error information for failed requests
  if (statusCode >= 400) {
    logData.metadata.errorMessage = responseData?.message || 'Unknown error';
  }

  await AuditLog.createLog(logData);
};

// Specific audit middleware for authentication events
export const auditAuth = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log authentication events
    if (req.user) {
      const action = req.path.includes('/login') ? 'LOGIN' : 
                    req.path.includes('/register') ? 'REGISTER' : 
                    req.path.includes('/logout') ? 'LOGOUT' : null;
      
      if (action) {
        AuditLog.createLog({
          action,
          resource: 'User',
          resourceId: req.user._id,
          userId: req.user._id,
          userEmail: req.user.email,
          userRole: req.user.role,
          metadata: {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            endpoint: req.originalUrl,
            method: req.method,
            statusCode: res.statusCode,
            additionalInfo: action === 'LOGIN' ? { loginMethod: 'password' } : {}
          }
        }).catch(err => console.error('Auth audit log error:', err));
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};