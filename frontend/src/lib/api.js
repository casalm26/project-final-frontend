// API configuration and client for Nanwa Forestry
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

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

  // Generic fetch wrapper with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: this.getHeaders(options.headers),
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
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

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
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
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
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