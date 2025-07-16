/**
 * Event emitter functions for real-time events
 * Used with response interceptor middleware
 */

/**
 * Extracts ID from request parameters or response data
 * @param {Object} params - Request parameters
 * @param {Object} data - Response data
 * @param {string} idField - Field name for ID in params
 * @param {string} dataField - Field name for nested data
 * @returns {string|null} - Extracted ID or null
 */
const extractId = (params, data, idField, dataField = 'data') => {
  const paramId = params[idField];
  if (paramId) return paramId;
  
  const responseData = data[dataField];
  return responseData?._id || responseData?.[dataField]?._id || null;
};

/**
 * Generic event emitter for resource updates
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} resource - Resource type (tree, forest)
 * @param {string} idField - ID field name for params
 * @param {Function} broadcastFunction - Function to broadcast updates
 */
const emitResourceEvent = (req, res, data, resource, idField, broadcastFunction) => {
  const resourceId = req.params[idField];
  const method = req.method;
  
  if (resourceId && method === 'PUT') {
    // Resource updated
    broadcastFunction(
      resourceId,
      data.data,
      `${resource}:updated`
    );
  } else if (method === 'POST' && data.data) {
    // New resource created
    const newResourceId = extractId(req.params, data, idField);
    if (newResourceId) {
      broadcastFunction(
        newResourceId,
        data.data,
        `${resource}:created`
      );
    }
  }
};

/**
 * Checks if realtime controller is available
 * @returns {boolean} - True if controller is available
 */
const isRealtimeControllerAvailable = () => {
  return global.realtimeController && typeof global.realtimeController === 'object';
};

/**
 * Determines action type based on HTTP method and path
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @returns {string|null} - Action type or null
 */
export const getActionFromRequest = (method, path) => {
  const pathSegments = path.split('/');
  const resource = pathSegments[2]; // /api/[resource]/...
  
  switch (method) {
    case 'POST':
      if (path.includes('/login')) return 'user_login';
      if (path.includes('/register')) return 'user_register';
      if (path.includes('/upload')) return 'image_upload';
      return `${resource}_create`;
    
    case 'PUT':
    case 'PATCH':
      return `${resource}_update`;
    
    case 'DELETE':
      return `${resource}_delete`;
    
    default:
      return null;
  }
};

/**
 * Emits tree-related events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Object} data - Response data
 */
export const emitTreeEvent = (req, res, data) => {
  if (!isRealtimeControllerAvailable()) return;
  
  emitResourceEvent(
    req,
    res,
    data,
    'tree',
    'treeId',
    global.realtimeController.broadcastTreeUpdate.bind(global.realtimeController)
  );
};

/**
 * Emits forest-related events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Object} data - Response data
 */
export const emitForestEvent = (req, res, data) => {
  if (!isRealtimeControllerAvailable()) return;
  
  emitResourceEvent(
    req,
    res,
    data,
    'forest',
    'forestId',
    global.realtimeController.broadcastForestUpdate.bind(global.realtimeController)
  );
};

/**
 * Emits image upload events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Object} data - Response data
 */
export const emitImageUploadEvent = (req, res, data) => {
  if (!isRealtimeControllerAvailable()) return;
  
  if (data.data && data.data.images) {
    const { treeId } = req.params;
    
    // Emit image upload events for each uploaded image
    data.data.images.forEach(image => {
      global.realtimeController.broadcastImageUpload(treeId, image);
    });
  }
};

/**
 * Creates user activity payload
 * @param {Object} user - User object
 * @param {string} action - Action type
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @returns {Object} - User activity payload
 */
const createUserActivityPayload = (user, action, path, method) => ({
  userId: user._id,
  user: {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  },
  action,
  path,
  method,
  timestamp: new Date()
});

/**
 * Emits user activity events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Object} data - Response data
 */
export const emitUserActivityEvent = (req, res, data) => {
  if (!req.user || !global.io) return;
  
  const { method, path } = req;
  const action = getActionFromRequest(method, path);
  
  if (action) {
    const payload = createUserActivityPayload(req.user, action, path, method);
    // Emit to admin users for monitoring
    global.io.to('admin').emit('user:activity', payload);
  }
};

/**
 * System notification emitter (not middleware-based)
 * @param {string} type - Notification type
 * @param {string} message - Notification message
 * @param {string} audience - Target audience ('all' or 'admin')
 */
export const emitSystemNotification = (type, message, audience = 'all') => {
  if (!isRealtimeControllerAvailable()) return;
  
  const notificationPayload = {
    type,
    message,
    level: 'info'
  };
  
  global.realtimeController.broadcastSystemNotification(notificationPayload, audience);
};