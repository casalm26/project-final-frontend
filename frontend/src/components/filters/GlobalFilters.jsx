import { useState, useEffect, useRef, useCallback } from 'react';
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
  // Only use initialFilters on mount
  const didInit = useRef(false);
  const onFiltersChangeRef = useRef(onFiltersChange);
  const hasMounted = useRef(false);
  
  // Keep the ref up to date
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  const [filters, setFilters] = useState(() => ({
    dateRange: {
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date()
    },
    selectedForests: [],
    ...initialFilters
  }));

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

  // Debounced notify parent of filter changes - FIXED: removed onFiltersChange from dependencies and prevent initial call
  useEffect(() => {
    // Don't call callback on initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      if (onFiltersChangeRef.current) {
        onFiltersChangeRef.current(filters);
      }
    }, 1000); // 1 second debounce
    return () => clearTimeout(timer);
  }, [filters]); // Only depend on filters, not the callback function

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
    setFilters({
      dateRange: {
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date()
      },
      selectedForests: []
    });
  }, []);

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