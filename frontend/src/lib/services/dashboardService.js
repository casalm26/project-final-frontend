import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

// Dashboard API methods
export const dashboardAPI = {
  getStats: (params = {}) => apiClient.get('/dashboard/stats', params),
};

// Chart API methods
export const chartAPI = {
  getSurvivalRate: (params = {}) => apiClient.get('/charts/survival-rate', params),
  getHeightGrowth: (params = {}) => apiClient.get('/charts/height-growth', params),
  getCO2Absorption: (params = {}) => apiClient.get('/charts/co2-absorption', params),
};