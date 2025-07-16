import { COLD_START_INDICATORS, RETRY_CONFIG } from '../config/apiConfig.js';

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Detects if an error is related to cold start conditions
 * @param {Error} error - The error object to check
 * @returns {boolean} - True if error indicates cold start
 */
export const isColdStartError = (error) => {
  if (!error || !error.message) return false;
  
  const errorMessage = error.message.toLowerCase();
  return COLD_START_INDICATORS.some(indicator => 
    errorMessage.includes(indicator)
  );
};

/**
 * Calculates retry delay with fixed delays for predictable timing
 * @param {number} attempt - The current attempt number (1-based)
 * @returns {number} - Delay in milliseconds
 */
export const calculateRetryDelay = (attempt) => {
  // Use fixed delays instead of exponential backoff for predictable 1-minute span
  return RETRY_CONFIG.retryDelays[attempt - 1] || RETRY_CONFIG.maxDelay;
};

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

/**
 * Retrieves the authentication token from localStorage
 * @returns {string|null} - The auth token or null if not found
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.warn('Failed to retrieve auth token from localStorage:', error);
    return null;
  }
};

/**
 * Checks if user is currently authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return Boolean(token);
};

// ============================================================================
// HEADER UTILITIES
// ============================================================================

/**
 * Creates default headers with optional authentication
 * @param {Object} customHeaders - Additional headers to merge
 * @returns {Object} - Complete headers object
 */
export const getHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Creates headers specifically for file uploads
 * @param {Object} customHeaders - Additional headers to merge
 * @returns {Object} - Headers object without Content-Type for multipart uploads
 */
export const getFileUploadHeaders = (customHeaders = {}) => {
  const headers = {
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData, let browser set it
  return headers;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates if a response status indicates success
 * @param {number} status - HTTP status code
 * @returns {boolean} - True if status indicates success
 */
export const isSuccessStatus = (status) => {
  return status >= 200 && status < 300;
};

/**
 * Checks if an error is a network-related error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if error is network-related
 */
export const isNetworkError = (error) => {
  if (!error) return false;
  
  return error.name === 'TypeError' && error.message.includes('fetch') ||
         error.name === 'AbortError' ||
         error.code === 'NETWORK_ERROR';
};

// TODO: Consider moving authentication state to Zustand store to eliminate localStorage duplication with authStore.js