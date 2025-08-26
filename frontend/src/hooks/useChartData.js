import { useState, useEffect, useCallback, useMemo } from 'react';
import { chartAPI } from '../lib/api';
import { transformFiltersForAPI } from '../utils/filterTransformer';

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Helper functions for cache management
const getCacheKey = (apiMethod, filters) => {
  const methodName = apiMethod.name || 'unknown';
  const filterString = JSON.stringify(filters);
  return `chart_${methodName}_${btoa(filterString)}`;
};

const getCachedData = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
};

const setCachedData = (cacheKey, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Cache write error:', error);
  }
};

// Generic hook for chart data fetching
const useChartData = (apiMethod, filters = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState(null);
  const { skip = false } = options;

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
      
      // Generate cache key
      const cacheKey = getCacheKey(apiMethod, apiFilters);
      
      // Try to get cached data first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
      
      // Fetch fresh data if not in cache
      const response = await apiMethod(apiFilters);
      const responseData = response.data;
      
      // Cache the fresh data
      setCachedData(cacheKey, responseData);
      setData(responseData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  }, [apiMethod, apiFilters]);

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [fetchData, skip]);

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