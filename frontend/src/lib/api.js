// Main API client entry point - refactored for better modularity
import { ApiClient } from './core/ApiClient.js';

// Re-export all service APIs for backward compatibility
export {
  authAPI,
  forestAPI,
  treeAPI,
  dashboardAPI,
  chartAPI,
  exportAPI,
  uploadAPI,
} from './services/index.js';

// Create singleton instance for direct client access
const apiClient = new ApiClient();

// TODO: Consider moving API state to Zustand store for better state management
// This would help with handling loading states, error states, and caching across components

// Default export
export default apiClient;