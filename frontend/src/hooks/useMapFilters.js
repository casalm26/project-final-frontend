import { useState, useCallback } from 'react';

export const useMapFilters = () => {
  const [filters, setFilters] = useState({});

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    handleFiltersChange,
    resetFilters
  };
};