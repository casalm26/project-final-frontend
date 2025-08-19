import { useState, useEffect } from 'react';
import { ForestMap } from '../components/map/ForestMap';
import { GlobalFilters } from '../components/filters';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { TreeDetailModal } from '../components/ui/TreeDetailModal';
import { useMapFilters } from '../hooks/useMapFilters';
import { useTreeSelection } from '../hooks/useTreeSelection';
import { useSidebarState } from '../hooks/useSidebarState';
import { treeAPI } from '../lib/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';export const MapPage = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarState();
  const { filters, handleFiltersChange } = useMapFilters();
  const { selectedTree, isModalOpen, handleTreeSelect, handleCloseTreeDetail } = useTreeSelection();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Fetch trees data
  useEffect(() => {
    const fetchTrees = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build API query params from filters
        const params = {};
        
        if (filters.selectedForests && filters.selectedForests.length > 0) {
          params.forestIds = filters.selectedForests.join(',');
        }
        
        if (filters.dateRange && filters.dateRange.startDate && filters.dateRange.endDate) {
          params.startDate = filters.dateRange.startDate.toISOString();
          params.endDate = filters.dateRange.endDate.toISOString();
        }
        
        const response = await treeAPI.getAll(params);
        
        // The API returns { success: true, data: { trees: [...], pagination: {...} } }
        // Handle different possible response structures
        let treesData = [];
        if (response.data && Array.isArray(response.data.trees)) {
          treesData = response.data.trees;
        } else if (response.data && Array.isArray(response.data)) {
          treesData = response.data;
        } else if (Array.isArray(response)) {
          treesData = response;
        }
        
        // Transform the data to include lat/lng from location if needed
        const transformedTrees = treesData.map(tree => ({
          ...tree,
          lat: tree.location?.coordinates?.[1] || tree.lat || 59.3293,
          lng: tree.location?.coordinates?.[0] || tree.lng || 18.0686,
          name: tree.treeId || tree.name || `Tree ${tree._id}`,
          health: tree.health || 'healthy'
        }));
        
        setTrees(transformedTrees);
      } catch (err) {
        console.error('Failed to fetch trees:', err);
        setError(err.message || 'Failed to load trees');
        // Set empty trees array on error so map doesn't crash
        setTrees([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrees();
  }, [filters]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardHeader onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forest Map</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Explore your forests and individual trees with interactive mapping.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Filters */}
            <GlobalFilters onFiltersChange={handleFiltersChange} />

            {/* Tree Detail Modal */}
            <TreeDetailModal
              tree={selectedTree}
              isOpen={isModalOpen}
              onClose={handleCloseTreeDetail}
            />

            {/* Map */}
            {loading ? (
              <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow">
                <LoadingSpinner text="Loading trees..." />
              </div>
            ) : (
              <ForestMap 
                trees={trees}
                onTreeSelect={handleTreeSelect}
                filters={filters}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </main>
    </div>
  );
}; 