// Re-export all stores from individual files
export { useAuthStore } from './authStore.js';
export { useFiltersStore } from './filtersStore.js';
export { useUIStore } from './uiStore.js';
export { useDataStore } from './dataStore.js';
export { useTreeStore } from './treeStore.js';
export { useForestStore } from './forestStore.js';

// Store hooks for easy access to commonly used data
export const useStoreData = () => {
  const { trees, forests, loading, error } = useDataStore();
  const { filters } = useFiltersStore();
  const { user, isAuthenticated } = useAuthStore();
  
  return {
    trees,
    forests,
    filters,
    loading,
    error,
    user,
    isAuthenticated
  };
};

// Combined tree and filter data hook
export const useFilteredTrees = () => {
  const { trees } = useTreeStore();
  const { filters } = useFiltersStore();
  
  return trees.filter(tree => {
    // Apply filters
    if (filters.status !== 'all' && tree.status !== filters.status) {
      return false;
    }
    
    if (filters.forests.length > 0) {
      const treeForestId = tree.forestId?._id || tree.forestId;
      if (!filters.forests.includes(treeForestId)) {
        return false;
      }
    }
    
    if (filters.species.length > 0 && !filters.species.includes(tree.species)) {
      return false;
    }
    
    if (filters.soilCondition && tree.metadata?.soilCondition !== filters.soilCondition) {
      return false;
    }
    
    if (filters.sunlightExposure && tree.metadata?.sunlightExposure !== filters.sunlightExposure) {
      return false;
    }
    
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      const searchableText = [
        tree.treeId,
        tree.species,
        tree.metadata?.notes || ''
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }
    
    if (filters.dateRange.start || filters.dateRange.end) {
      const plantedDate = new Date(tree.plantedDate);
      
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (plantedDate < startDate) {
          return false;
        }
      }
      
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        if (plantedDate > endDate) {
          return false;
        }
      }
    }
    
    return true;
  });
};