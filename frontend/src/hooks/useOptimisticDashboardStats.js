import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardAPI } from '../lib/api';
import { transformFiltersForAPI } from '../utils/filterTransformer';

// Cache TTL for dashboard stats (10 minutes for longer caching)
const DASHBOARD_CACHE_TTL = 10 * 60 * 1000;

// Dashboard cache helpers
const getDashboardCacheKey = (filters) => {
  const filterString = JSON.stringify(filters);
  return `dashboard_stats_${btoa(filterString)}`;
};

const getCachedDashboardStats = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    return { data, timestamp, isExpired: Date.now() - timestamp > DASHBOARD_CACHE_TTL };
  } catch (error) {
    console.warn('Dashboard cache read error:', error);
    return null;
  }
};

const setCachedDashboardStats = (cacheKey, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Dashboard cache write error:', error);
  }
};

export const useOptimisticDashboardStats = (filters = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState(null);

  // Transform filters to API format and memoize
  const apiFilters = useMemo(() => {
    if (!filters) return {};
    
    // Ensure dateRange has a default structure
    const safeFilters = {
      ...filters,
      dateRange: filters.dateRange || { start: null, end: null },
      forests: filters.forests || [],
      species: filters.species || []
    };
    
    // Convert new filter format to legacy format for transformFiltersForAPI
    const legacyFilters = {
      dateRange: {
        startDate: safeFilters.dateRange.start,
        endDate: safeFilters.dateRange.end
      },
      selectedForests: safeFilters.forests,
      species: safeFilters.species
    };
    return transformFiltersForAPI(legacyFilters);
  }, [
    filters?.dateRange?.start,
    filters?.dateRange?.end,
    filters?.forests,
    filters?.species
  ]);

  const fetchStats = useCallback(async (showStaleData = true) => {
    try {
      const cacheKey = getDashboardCacheKey(apiFilters);
      const cached = getCachedDashboardStats(cacheKey);
      
      // If we have cached data, show it immediately (optimistic loading)
      if (cached && showStaleData) {
        setStats(cached.data);
        setLoading(false);
        setIsStale(cached.isExpired);
        
        // If data is fresh, don't fetch again
        if (!cached.isExpired) {
          setError(null);
          return;
        }
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      // Fetch fresh data in background
      const response = await dashboardAPI.getEnhancedStats(apiFilters);
      const responseData = response.data;
      
      // Cache and update state
      setCachedDashboardStats(cacheKey, responseData);
      setStats(responseData);
      setIsStale(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [apiFilters]);

  // Fetch data when filters change
  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats(false); // Force fresh fetch without showing stale data
  }, [fetchStats]);

  return {
    stats,
    loading,
    isStale,
    error,
    refresh
  };
};