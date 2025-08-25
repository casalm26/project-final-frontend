import { useState, useEffect, useCallback, useMemo } from 'react';
import { chartAPI } from '../lib/api';
import { transformFiltersForAPI } from '../utils/filterTransformer';

// Generic hook for chart data fetching
const useChartData = (apiMethod, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform filters to API format and memoize
  const apiFilters = useMemo(() => {
    return transformFiltersForAPI(filters);
  }, [
    filters?.dateRange?.startDate,
    filters?.dateRange?.endDate,
    filters?.selectedForests,
    filters?.species
  ]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiMethod(apiFilters);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  }, [apiMethod, apiFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh
  };
};

// Specific hooks for each chart type
export const useSurvivalRateData = (filters = {}) => {
  return useChartData(chartAPI.getSurvivalRate, filters);
};

export const useHeightGrowthData = (filters = {}) => {
  return useChartData(chartAPI.getHeightGrowth, filters);
};

export const useCO2AbsorptionData = (filters = {}) => {
  return useChartData(chartAPI.getCO2Absorption, filters);
};