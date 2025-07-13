import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { DateRangePicker } from './DateRangePicker';
import { ForestSelector } from './ForestSelector';

const FiltersContainer = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FiltersSubtitle = styled.p`
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ClearAllButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #dc2626;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

export const GlobalFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const didInit = useRef(false);
  const onFiltersChangeRef = useRef(onFiltersChange);
  const hasMounted = useRef(false);
  
  // Keep the ref up to date
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

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

  const [filters, setFilters] = useState(() => {
    const urlFilters = getFiltersFromURL();
    return {
      dateRange: {
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date()
      },
      selectedForests: [],
      ...initialFilters,
      ...urlFilters // URL parameters take precedence
    };
  });

  const [filterErrors, setFilterErrors] = useState({});

  // Validate filters
  const validateFilters = useCallback((filtersToValidate) => {
    const errors = {};

    // Validate date range
    if (filtersToValidate.dateRange) {
      const { startDate, endDate } = filtersToValidate.dateRange;
      
      if (startDate && endDate) {
        if (startDate > endDate) {
          errors.dateRange = 'Start date must be before or equal to end date';
        }
        
        if (endDate > new Date()) {
          errors.dateRange = 'End date cannot be in the future';
        }
        
        // Check if date range is too large (more than 5 years)
        const diffYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
        if (diffYears > 5) {
          errors.dateRange = 'Date range cannot exceed 5 years';
        }
      }
    }

    // Validate selected forests (optional - could check against available forests)
    if (filtersToValidate.selectedForests && filtersToValidate.selectedForests.length > 10) {
      errors.selectedForests = 'Cannot select more than 10 forests at once';
    }

    setFilterErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Update URL parameters when filters change
  const updateURLParams = useCallback((newFilters) => {
    const params = new URLSearchParams();

    // Add date range to URL
    if (newFilters.dateRange?.startDate && newFilters.dateRange?.endDate) {
      params.set('startDate', newFilters.dateRange.startDate.toISOString().split('T')[0]);
      params.set('endDate', newFilters.dateRange.endDate.toISOString().split('T')[0]);
    }

    // Add selected forests to URL
    if (newFilters.selectedForests && newFilters.selectedForests.length > 0) {
      params.set('forests', newFilters.selectedForests.join(','));
    }

    // Update URL without triggering navigation
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    if (!didInit.current && Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...initialFilters }));
      didInit.current = true;
    }
  }, []); // Only run on mount

  const [activeFilters, setActiveFilters] = useState([]);

  // Update active filters display
  useEffect(() => {
    const active = [];
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      const startDate = filters.dateRange.startDate.toLocaleDateString();
      const endDate = filters.dateRange.endDate.toLocaleDateString();
      active.push(`Date: ${startDate} - ${endDate}`);
    }
    if (filters.selectedForests.length > 0) {
      active.push(`${filters.selectedForests.length} forests selected`);
    }
    setActiveFilters(active);
  }, [filters]);

  // Debounced notify parent of filter changes with validation and URL persistence
  useEffect(() => {
    // Don't call callback on initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      // Validate filters before applying
      const isValid = validateFilters(filters);
      
      if (isValid) {
        // Update URL parameters
        updateURLParams(filters);
        
        // Notify parent component
        if (onFiltersChangeRef.current) {
          onFiltersChangeRef.current(filters);
        }
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timer);
  }, [filters, validateFilters, updateURLParams]);

  const handleDateChange = useCallback((dateRange) => {
    setFilters(prev => ({
      ...prev,
      dateRange
    }));
  }, []);

  const handleForestChange = useCallback((selectedForests) => {
    setFilters(prev => ({
      ...prev,
      selectedForests
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    const clearedFilters = {
      dateRange: {
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date()
      },
      selectedForests: []
    };
    setFilters(clearedFilters);
    setFilterErrors({});
    
    // Clear URL parameters
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return (
    <FiltersContainer>
      <FiltersHeader>
        <div>
          <FiltersTitle>Global Filters</FiltersTitle>
          <FiltersSubtitle>
            Filter your data by date range and forest selection
          </FiltersSubtitle>
        </div>
        {activeFilters.length > 0 && (
          <ClearAllButton onClick={handleClearAll}>
            Clear All
          </ClearAllButton>
        )}
      </FiltersHeader>

      {/* Display filter errors */}
      {Object.keys(filterErrors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-red-800">Filter Validation Errors</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(filterErrors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <FiltersGrid>
        <DateRangePicker
          onDateChange={handleDateChange}
          initialStartDate={filters.dateRange.startDate}
          initialEndDate={filters.dateRange.endDate}
        />
        <ForestSelector
          selectedForests={filters.selectedForests}
          onChange={handleForestChange}
        />
      </FiltersGrid>

      {activeFilters.length > 0 && (
        <ActiveFilters>
          {activeFilters.map((filter, index) => (
            <FilterTag key={index}>
              {filter}
            </FilterTag>
          ))}
        </ActiveFilters>
      )}
    </FiltersContainer>
  );
}; 