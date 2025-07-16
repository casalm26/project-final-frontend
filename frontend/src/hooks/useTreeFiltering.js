import { useMemo } from 'react';

export const useTreeFiltering = (trees, filters) => {
  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      // Apply forest filters if selected forests exist
      if (filters.selectedForests && filters.selectedForests.length > 0) {
        // For now, assume tree has a forestId property (will be updated when backend is ready)
        // Currently using a mock forestId based on tree position
        const mockForestId = tree.id <= 4 ? 1 : 2; // Mock forest assignment
        if (!filters.selectedForests.includes(mockForestId)) {
          return false;
        }
      }
      
      // Apply date range filters if specified
      if (filters.dateRange) {
        // For now, assume tree has a plantedDate property (will be updated when backend is ready)
        // Currently using a mock date based on tree ID
        const mockPlantedDate = new Date(2023, tree.id % 12, tree.id % 28 + 1); // Mock planting date
        if (mockPlantedDate < filters.dateRange.startDate || mockPlantedDate > filters.dateRange.endDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [trees, filters]);

  return filteredTrees;
};