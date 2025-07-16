import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

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