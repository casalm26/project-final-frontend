import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateRangePicker } from './DateRangePicker';
import { ForestSelector } from './ForestSelector';
import { FilterErrors } from './FilterErrors';
import { formatDateForInput } from '@utils/dateUtils';
import { validateFilters, createDefaultFilters } from '@utils/filterValidation';
import { useFiltersStore } from '../../lib/stores/filtersStore';


export const GlobalFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const onFiltersChangeRef = useRef(onFiltersChange);
  const hasMounted = useRef(false);
  const didInitURL = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activePreset, setActivePreset] = useState(null);
  const [filterErrors, setFilterErrors] = useState({});

  // Get filter state and actions from store
  const {
    filters,
    setFilters,
    clearFilters,
    setDateRange,
    setForestFilter,
    getActiveFiltersCount,
    hasActiveFilters,
  } = useFiltersStore();
  
  // Ensure filters has default structure
  const safeFilters = filters || {
    dateRange: { start: null, end: null },
    forests: [],
    regions: [],
    species: [],
    status: 'all',
    soilCondition: '',
    sunlightExposure: '',
    search: ''
  };
  
  // Keep the ref up to date
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  // Initialize from URL parameters only once on mount
  useEffect(() => {
    if (!didInitURL.current) {
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');
      const forestsParam = searchParams.get('forests');

      let needsUpdate = false;
      const urlFilters = { ...safeFilters };

      // Parse date range from URL
      if (startDateParam && endDateParam) {
        try {
          const startDate = new Date(startDateParam);
          const endDate = new Date(endDateParam);
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
            urlFilters.dateRange = { start: startDate, end: endDate };
            needsUpdate = true;
          }
        } catch (error) {
          console.warn('Invalid date parameters in URL:', error);
        }
      }

      // Parse selected forests from URL
      if (forestsParam) {
        try {
          const forestIds = forestsParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
          if (forestIds.length > 0) {
            urlFilters.forests = forestIds;
            needsUpdate = true;
          }
        } catch (error) {
          console.warn('Invalid forest parameters in URL:', error);
        }
      }

      // Apply URL filters to store if found
      if (needsUpdate) {
        setFilters(urlFilters);
      }
      
      // Apply any initial filters passed as props
      if (Object.keys(initialFilters).length > 0) {
        setFilters({ ...urlFilters, ...initialFilters });
      }

      didInitURL.current = true;
    }
  }, [searchParams, setFilters, initialFilters, safeFilters]);

  // Update URL parameters when filters change
  const updateURLParams = useCallback((currentFilters) => {
    const params = new URLSearchParams();

    // Add date range to URL
    if (currentFilters.dateRange?.start && currentFilters.dateRange?.end) {
      params.set('startDate', formatDateForInput(currentFilters.dateRange.start));
      params.set('endDate', formatDateForInput(currentFilters.dateRange.end));
    }

    // Add selected forests to URL
    if (currentFilters.forests && currentFilters.forests.length > 0) {
      params.set('forests', currentFilters.forests.join(','));
    }

    // Update URL without triggering navigation
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Debounced notify parent of filter changes with validation and URL persistence
  useEffect(() => {
    // Don't call callback on initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      // Create compatible filter format for validation
      const validationFilters = {
        dateRange: {
          startDate: safeFilters.dateRange.start,
          endDate: safeFilters.dateRange.end,
        },
        selectedForests: safeFilters.forests,
      };
      
      // Validate filters
      const errors = validateFilters(validationFilters);
      setFilterErrors(errors);
      
      const isValid = Object.keys(errors).length === 0;
      
      if (isValid) {
        // Update URL parameters
        updateURLParams(safeFilters);
        
        // Notify parent component with store's getApiParams format
        if (onFiltersChangeRef.current) {
          onFiltersChangeRef.current(safeFilters);
        }
      }
    }, 300); // Reduced debounce for better responsiveness
    
    return () => clearTimeout(timer);
  }, [safeFilters, updateURLParams]);

  // Calculate active filters for display
  const activeFilters = [];
  if (safeFilters.dateRange.start && safeFilters.dateRange.end) {
    const startDate = safeFilters.dateRange.start.toLocaleDateString();
    const endDate = safeFilters.dateRange.end.toLocaleDateString();
    activeFilters.push(`Date: ${startDate} - ${endDate}`);
  }
  if (safeFilters.forests.length > 0) {
    activeFilters.push(`${safeFilters.forests.length} forests selected`);
  }

  const handleDateChange = useCallback((dateRange) => {
    // Convert from old format to store format
    setDateRange({
      start: dateRange.startDate,
      end: dateRange.endDate
    });
  }, [setDateRange]);

  const handleForestChange = useCallback((selectedForests) => {
    setForestFilter(selectedForests);
  }, [setForestFilter]);

  const handleClearAll = useCallback(() => {
    clearFilters();
    setFilterErrors({});
    setActivePreset(null);
    
    // Clear URL parameters
    setSearchParams({}, { replace: true });
  }, [clearFilters, setSearchParams]);

  const applyDatePreset = useCallback((presetName) => {
    const now = new Date();
    let startDate, endDate;
    
    switch (presetName) {
      case 'mtd': // Month to date
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'ytd': // Year to date
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        endDate = now;
        break;
      case '3years':
        startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        endDate = now;
        break;
      case '5years':
        startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        endDate = now;
        break;
      case 'all':
        startDate = null;
        endDate = null;
        break;
      default:
        return;
    }
    
    setActivePreset(presetName);
    handleDateChange({ startDate, endDate });
  }, [handleDateChange]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Reset active preset when dates are manually changed
  useEffect(() => {
    // Only reset if dates were changed manually (not by preset)
    if (activePreset && safeFilters.dateRange.start && safeFilters.dateRange.end) {
      // For now, simply reset preset when dates change
      // This could be enhanced to detect if dates match specific presets
      setActivePreset(null);
    }
  }, [safeFilters.dateRange, activePreset]);

  return (
    <div className={`bg-gray-50 rounded-xl border border-gray-200 mb-8 transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
      <div className={`flex justify-between items-center ${isCollapsed ? 'mb-0' : 'mb-6'}`}>
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              Global Filters
              {isCollapsed && activeFilters.length > 0 && (
                <span className="text-gray-600 text-sm ml-2">
                  ({activeFilters.length} active)
                </span>
              )}
            </h2>
            {!isCollapsed && (
              <p className="text-gray-600 mt-2 mb-0 text-sm">
                Filter your data by date range and forest selection
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearAll}
            className={`px-4 py-2 bg-red-500 text-white border-0 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-3 focus:ring-blue-200 ${!isCollapsed && activeFilters.length > 0 ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
          >
            Clear All
          </button>
          <button 
            onClick={toggleCollapsed}
            aria-expanded={!isCollapsed}
            aria-controls="global-filters-content"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white border-0 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-blue-200"
          >
            {isCollapsed ? (
              <>
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                Show Filters
              </>
            ) : (
              <>
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                Hide Filters
              </>
            )}
          </button>
        </div>
      </div>

      <div id="global-filters-content" className={isCollapsed ? 'hidden' : 'block'}>
        <FilterErrors errors={filterErrors} />
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === 'mtd' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('mtd')}
          >
            Month to Date
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === 'ytd' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('ytd')}
          >
            Year to Date
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === '30days' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('30days')}
          >
            Last 30 Days
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === '90days' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('90days')}
          >
            Last 90 Days
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === '1year' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('1year')}
          >
            Last 1 Year
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === '3years' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('3years')}
          >
            Last 3 Years
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === '5years' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('5years')}
          >
            Last 5 Years
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 rounded border focus:outline-none focus:ring-2 focus:ring-green-200 ${activePreset === 'all' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
            onClick={() => applyDatePreset('all')}
          >
            All Time
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateRangePicker
            onDateChange={handleDateChange}
            initialStartDate={safeFilters.dateRange.start}
            initialEndDate={safeFilters.dateRange.end}
          />
          <ForestSelector
            selectedForests={safeFilters.forests}
            onChange={handleForestChange}
          />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {activeFilters.map((filter, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                {filter}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 