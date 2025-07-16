import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDateForInput } from '@utils/dateUtils';

/**
 * Custom hook for handling filter parameters in URL
 * Manages URL synchronization for GlobalFilters component
 */
export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL on initial load
  const getFiltersFromURL = useCallback(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const forestsParam = searchParams.get('forests');

    const urlFilters = {};

    // Parse date range from URL
    if (startDateParam && endDateParam) {
      try {
        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);
        
        // Validate dates
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
          urlFilters.dateRange = { startDate, endDate };
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
          urlFilters.selectedForests = forestIds;
        }
      } catch (error) {
        console.warn('Invalid forest parameters in URL:', error);
      }
    }

    return urlFilters;
  }, [searchParams]);

  // Update URL parameters when filters change
  const updateURLParams = useCallback((newFilters) => {
    const params = new URLSearchParams();

    // Add date range to URL
    if (newFilters.dateRange?.startDate && newFilters.dateRange?.endDate) {
      params.set('startDate', formatDateForInput(newFilters.dateRange.startDate));
      params.set('endDate', formatDateForInput(newFilters.dateRange.endDate));
    }

    // Add selected forests to URL
    if (newFilters.selectedForests && newFilters.selectedForests.length > 0) {
      params.set('forests', newFilters.selectedForests.join(','));
    }

    // Update URL without triggering navigation
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Clear all URL parameters
  const clearURLParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    getFiltersFromURL,
    updateURLParams,
    clearURLParams
  };
};