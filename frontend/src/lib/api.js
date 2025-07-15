// API configuration and client for Nanwa Forestry
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Cold start detection and retry configuration
const COLD_START_INDICATORS = [
  'failed to fetch',
  'network request failed',
  'timeout',
  'connection refused',
  'service unavailable',
  'internal server error'
];

const RETRY_CONFIG = {
  maxAttempts: 4,
  baseDelay: 5000, // Start with 5 seconds
  maxDelay: 20000, // Max 20 seconds between retries
  backoffMultiplier: 1.5, // Gentler backoff
  coldStartTimeouts: [15000, 20000, 25000, 30000], // Progressive timeouts for cold starts
  retryDelays: [5000, 10000, 15000, 20000], // Fixed delays: 5s, 10s, 15s, 20s (total: 50s + initial attempt)
};

// API client with authentication and error handling
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Default headers with authentication
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Helper method to detect cold start conditions
  isColdStartError(error) {
    const errorMessage = error.message.toLowerCase();
    return COLD_START_INDICATORS.some(indicator => 
      errorMessage.includes(indicator)
    );
  }

  // Helper method to calculate retry delay with fixed delays for predictable timing
  calculateRetryDelay(attempt) {
    // Use fixed delays instead of exponential backoff for predictable 1-minute span
    return RETRY_CONFIG.retryDelays[attempt - 1] || RETRY_CONFIG.maxDelay;
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
      headers: this.getHeaders(options.headers),
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
        error.message = 'Request timeout';
      }

      // Check if this is a cold start error and if we should retry
      const shouldRetry = this.isColdStartError(error) && retryAttempts < RETRY_CONFIG.maxAttempts - 1;
      
      if (shouldRetry) {
        const nextAttempt = retryAttempts + 1;
        const delay = this.calculateRetryDelay(nextAttempt);
        
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
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...this.getHeaders(),
        'Content-Type': undefined,
      },
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Authentication API methods
export const authAPI = {
  register: (userData, options = {}) => apiClient.post('/auth/register', userData, options),
  login: (credentials, options = {}) => apiClient.post('/auth/login', credentials, options),
  logout: () => apiClient.post('/auth/logout'),
  logoutAll: () => apiClient.post('/auth/logout-all'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
};

// Forest API methods
export const forestAPI = {
  getAll: (filters = {}) => apiClient.get('/forests', filters),
  getById: (id) => apiClient.get(`/forests/${id}`),
  getAnalytics: (id) => apiClient.get(`/forests/${id}/analytics`),
  create: (forestData) => apiClient.post('/forests', forestData),
  update: (id, forestData) => apiClient.put(`/forests/${id}`, forestData),
  delete: (id) => apiClient.delete(`/forests/${id}`),
};

// Tree API methods
export const treeAPI = {
  getAll: (filters = {}) => apiClient.get('/trees', filters),
  getById: (id) => apiClient.get(`/trees/${id}`),
  getMeasurements: (id) => apiClient.get(`/trees/${id}/measurements`),
  getByForest: (forestId) => apiClient.get(`/trees/forest/${forestId}`),
  create: (treeData) => apiClient.post('/trees', treeData),
  update: (id, treeData) => apiClient.put(`/trees/${id}`, treeData),
  delete: (id) => apiClient.delete(`/trees/${id}`),
  addMeasurement: (id, measurementData) => apiClient.post(`/trees/${id}/measurements`, measurementData),
  markDead: (id) => apiClient.patch(`/trees/${id}/mark-dead`),
};

// Dashboard API methods
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
};

// Chart API methods
export const chartAPI = {
  getSurvivalRate: () => apiClient.get('/charts/survival-rate'),
  getHeightGrowth: () => apiClient.get('/charts/height-growth'),
  getCO2Absorption: () => apiClient.get('/charts/co2-absorption'),
};

// Export API methods
export const exportAPI = {
  exportTrees: (filters = {}) => apiClient.post('/exports/trees', filters),
};

// Upload API methods
export const uploadAPI = {
  uploadTreeImages: (formData) => apiClient.uploadFile('/uploads/tree-images', formData),
};

// Audit API methods
export const auditAPI = {
  getLogs: (filters = {}) => apiClient.get('/audit', filters),
};

// Bulk operations API methods
export const bulkAPI = {
  bulkTreeOperations: (operations) => apiClient.post('/bulk/trees', operations),
};

// Default export
export default apiClient;