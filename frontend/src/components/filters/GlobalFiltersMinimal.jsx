import { useState } from 'react';
import { useFiltersStore } from '../../lib/stores/filtersStore';

export const GlobalFilters = ({ onFiltersChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Get store state and actions
  const filters = useFiltersStore((state) => state.filters);
  const clearFilters = useFiltersStore((state) => state.clearFilters);
  const hasActiveFilters = useFiltersStore((state) => state.hasActiveFilters());
  const activeFiltersCount = useFiltersStore((state) => state.getActiveFiltersCount());

  const handleClearAll = () => {
    clearFilters();
  };

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customize your data view
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Active filters count */}
          {hasActiveFilters && (
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {activeFiltersCount} active
            </span>
          )}
          
          {/* Clear all button */}
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            disabled={!hasActiveFilters}
          >
            Clear All
          </button>
          
          {/* Collapse toggle */}
          <button
            onClick={toggleCollapsed}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Simple content when expanded */}
      {!isCollapsed && (
        <div className="text-gray-600 dark:text-gray-400">
          Filters functionality temporarily simplified for debugging.
        </div>
      )}
    </div>
  );
};