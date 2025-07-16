// Legacy store file - individual stores have been moved to separate files
// This file maintains backward compatibility while the new modular structure is being adopted

// Re-export all stores from the new modular structure
export { 
  useAuthStore, 
  useFiltersStore, 
  useUIStore, 
  useDataStore 
} from './stores/index.js';

// Backward compatibility: export useAppStore pointing to the most commonly used store
// TODO: Update components to use specific stores instead of the combined useAppStore
export { useFiltersStore as useAppStore } from './stores/index.js'; 