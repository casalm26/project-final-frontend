import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { DateRangePicker } from './DateRangePicker';
import { ForestSelector } from './ForestSelector';
import { FilterErrors } from './FilterErrors';
import { formatDateForInput } from '@utils/dateUtils';
import { validateFilters, createDefaultFilters } from '@utils/filterValidation';

const FiltersContainer = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: ${props => props.$isCollapsed ? '1rem' : '1.5rem'};
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.$isCollapsed ? '0' : '1.5rem'};
`;

const FiltersTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FiltersSubtitle = styled.p`
  color: #4b5563;
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
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #059669;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CollapsedInfo = styled.span`
  color: #4b5563;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const FiltersContent = styled.div`
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
`;

const PresetButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PresetButton = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${props => props.$isActive ? '#10b981' : '#ffffff'};
  color: ${props => props.$isActive ? 'white' : '#374151'};
  border: 1px solid ${props => props.$isActive ? '#10b981' : '#d1d5db'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isActive ? '#059669' : '#f3f4f6'};
    border-color: ${props => props.$isActive ? '#059669' : '#9ca3af'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

export const GlobalFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const didInit = useRef(false);
  const onFiltersChangeRef = useRef(onFiltersChange);
  const hasMounted = useRef(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [activePreset, setActivePreset] = useState(null);
  
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
      ...createDefaultFilters(),
      ...initialFilters,
      ...urlFilters // URL parameters take precedence
    };
  });

  const [filterErrors, setFilterErrors] = useState({});

  // Validate filters using centralized validation utility
  const validateFiltersWithState = useCallback((filtersToValidate) => {
    const errors = validateFilters(filtersToValidate);
    setFilterErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

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
      const isValid = validateFiltersWithState(filters);
      
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
  }, [filters, validateFiltersWithState, updateURLParams]);

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
    const clearedFilters = createDefaultFilters();
    setFilters(clearedFilters);
    setFilterErrors({});
    setActivePreset(null);
    
    // Clear URL parameters
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

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
    if (activePreset && filters.dateRange.startDate && filters.dateRange.endDate) {
      const now = new Date();
      const { startDate, endDate } = filters.dateRange;
      
      // Check if current dates match any preset
      let matchesPreset = false;
      // Add logic here if needed to verify preset match
      
      if (!matchesPreset) {
        setActivePreset(null);
      }
    }
  }, [filters.dateRange, activePreset]);

  return (
    <FiltersContainer $isCollapsed={isCollapsed}>
      <FiltersHeader $isCollapsed={isCollapsed}>
        <HeaderLeft>
          <div>
            <FiltersTitle>
              Global Filters
              {isCollapsed && activeFilters.length > 0 && (
                <CollapsedInfo>
                  ({activeFilters.length} active)
                </CollapsedInfo>
              )}
            </FiltersTitle>
            {!isCollapsed && (
              <FiltersSubtitle>
                Filter your data by date range and forest selection
              </FiltersSubtitle>
            )}
          </div>
        </HeaderLeft>
        <HeaderRight>
          <ClearAllButton 
            onClick={handleClearAll}
            style={{ 
              visibility: !isCollapsed && activeFilters.length > 0 ? 'visible' : 'hidden',
              pointerEvents: !isCollapsed && activeFilters.length > 0 ? 'auto' : 'none'
            }}
          >
            Clear All
          </ClearAllButton>
          <ToggleButton 
            onClick={toggleCollapsed}
            aria-expanded={!isCollapsed}
            aria-controls="global-filters-content"
          >
            {isCollapsed ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                Show Filters
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                Hide Filters
              </>
            )}
          </ToggleButton>
        </HeaderRight>
      </FiltersHeader>

      <FiltersContent id="global-filters-content" $isCollapsed={isCollapsed}>
        <FilterErrors errors={filterErrors} />
        
        <PresetButtons>
          <PresetButton 
            $isActive={activePreset === 'mtd'}
            onClick={() => applyDatePreset('mtd')}
          >
            Month to Date
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === 'ytd'}
            onClick={() => applyDatePreset('ytd')}
          >
            Year to Date
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === '30days'}
            onClick={() => applyDatePreset('30days')}
          >
            Last 30 Days
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === '90days'}
            onClick={() => applyDatePreset('90days')}
          >
            Last 90 Days
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === '1year'}
            onClick={() => applyDatePreset('1year')}
          >
            Last 1 Year
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === '3years'}
            onClick={() => applyDatePreset('3years')}
          >
            Last 3 Years
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === '5years'}
            onClick={() => applyDatePreset('5years')}
          >
            Last 5 Years
          </PresetButton>
          <PresetButton 
            $isActive={activePreset === 'all'}
            onClick={() => applyDatePreset('all')}
          >
            All Time
          </PresetButton>
        </PresetButtons>

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
      </FiltersContent>
    </FiltersContainer>
  );
}; 