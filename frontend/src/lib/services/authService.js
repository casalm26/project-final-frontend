import { ApiClient } from '../core/ApiClient.js';

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