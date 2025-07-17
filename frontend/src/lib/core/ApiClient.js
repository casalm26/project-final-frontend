import { API_BASE_URL, RETRY_CONFIG } from '../config/apiConfig.js';
import { isColdStartError, calculateRetryDelay, getHeaders, getFileUploadHeaders } from '../utils/apiUtils.js';

// API client with authentication and error handling
export class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch wrapper with error handling and retry logic
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { retryAttempts = 0, onRetry } = options;
    
    // Use progressive timeout for cold starts
    const timeoutDuration = retryAttempts < RETRY_CONFIG.coldStartTimeouts.length 
      ? RETRY_CONFIG.coldStartTimeouts[retryAttempts]
      : RETRY_CONFIG.coldStartTimeouts[RETRY_CONFIG.coldStartTimeouts.length - 1];

    const config = {
      timeout: timeoutDuration,
      headers: getHeaders(options.headers),
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.name = 'AbortError';
        timeoutError.status = 408;
        throw timeoutError;
      }

      // Check if this is a cold start error and if we should retry
      const shouldRetry = isColdStartError(error) && retryAttempts < RETRY_CONFIG.maxAttempts - 1;
      
      if (shouldRetry) {
        const nextAttempt = retryAttempts + 1;
        const delay = calculateRetryDelay(nextAttempt);
        
        // Notify about retry attempt
        if (onRetry) {
          onRetry({
            attempt: nextAttempt,
            totalAttempts: RETRY_CONFIG.maxAttempts,
            delay,
            error: error.message,
            isColdStart: true
          });
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with incremented attempt count
        return this.request(endpoint, {
          ...options,
          retryAttempts: nextAttempt,
          onRetry
        });
      }

      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: getFileUploadHeaders(),
    });
  }
}