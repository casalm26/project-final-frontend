/**
 * Response interceptor utility for middleware that needs to emit events after successful responses
 */

/**
 * Configuration constants for response interceptor
 */
const INTERCEPTOR_CONFIG = {
  SUCCESS_PROPERTY: 'success',
  GLOBAL_CONTROLLER_KEY: 'realtimeController'
};

/**
 * Validates that the callback is a function
 * @param {*} callback - The callback to validate
 * @throws {Error} - If callback is not a function
 */
const validateCallback = (callback) => {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }
};

/**
 * Checks if a response indicates success
 * @param {*} data - Response data to check
 * @returns {boolean} - Whether the response indicates success
 */
const isSuccessResponse = (data) => {
  return data && data[INTERCEPTOR_CONFIG.SUCCESS_PROPERTY] === true;
};

/**
 * Safely executes a callback function with error handling
 * @param {Function} callback - The callback function to execute
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 */
const safeCallbackExecution = (callback, req, res, data) => {
  try {
    callback(req, res, data);
  } catch (error) {
    console.error('Response interceptor callback error:', error);
    // TODO: Consider using a proper logging service instead of console.error
  }
};

/**
 * Creates a response interceptor that calls a callback function after a successful response
 * @param {Function} callback - Function to call with (req, res, data) after successful response
 * @returns {Function} - Middleware function
 */
export const createResponseInterceptor = (callback) => {
  validateCallback(callback);
  
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to intercept response
    res.json = function(data) {
      // Call original json method first
      const result = originalJson.call(this, data);
      
      // Call callback if operation was successful
      if (isSuccessResponse(data)) {
        safeCallbackExecution(callback, req, res, data);
      }
      
      return result;
    };
    
    next();
  };
};

/**
 * Checks if the global realtime controller is available
 * @returns {boolean} - Whether the realtime controller is available
 */
const isRealtimeControllerAvailable = () => {
  return global[INTERCEPTOR_CONFIG.GLOBAL_CONTROLLER_KEY] !== undefined;
};

/**
 * Generic response interceptor for real-time events
 * @param {Function} eventEmitter - Function that emits the appropriate event
 * @returns {Function} - Middleware function
 */
export const createRealtimeEventMiddleware = (eventEmitter) => {
  validateCallback(eventEmitter);
  
  return createResponseInterceptor((req, res, data) => {
    if (isRealtimeControllerAvailable()) {
      eventEmitter(req, res, data);
    }
  });
};