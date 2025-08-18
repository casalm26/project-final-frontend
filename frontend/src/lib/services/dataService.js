import { ApiClient } from '../core/ApiClient.js';

const apiClient = new ApiClient();

// Export API methods
export const exportAPI = {
  exportTreesCSV: (params = {}, filename = 'trees_export.csv') => 
    apiClient.downloadFile('/exports/trees/csv', params, filename),
  exportTreesXLSX: (params = {}, filename = 'trees_export.xlsx') => 
    apiClient.downloadFile('/exports/trees/xlsx', params, filename),
  exportForestAnalytics: (params = {}, filename = 'forest_analytics.xlsx') => 
    apiClient.downloadFile('/exports/forest-analytics', params, filename),
  // Unified export method that handles both CSV and XLSX
  exportTrees: (params = {}) => {
    const { format = 'csv', ...queryParams } = params;
    const filename = `trees_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const endpoint = format === 'xlsx' ? '/exports/trees/xlsx' : '/exports/trees/csv';
    return apiClient.downloadFile(endpoint, queryParams, filename);
  }
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