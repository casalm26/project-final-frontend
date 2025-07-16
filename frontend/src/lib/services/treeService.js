import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

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