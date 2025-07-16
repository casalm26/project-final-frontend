import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

// Forest API methods
export const forestAPI = {
  getAll: (filters = {}) => apiClient.get('/forests', filters),
  getById: (id) => apiClient.get(`/forests/${id}`),
  getAnalytics: (id) => apiClient.get(`/forests/${id}/analytics`),
  create: (forestData) => apiClient.post('/forests', forestData),
  update: (id, forestData) => apiClient.put(`/forests/${id}`, forestData),
  delete: (id) => apiClient.delete(`/forests/${id}`),
};