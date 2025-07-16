import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

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