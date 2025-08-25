import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardAPI } from '../lib/api';
import { transformFiltersForAPI } from '../utils/filterTransformer';

export const useDashboardStats = (filters = {}) => {
  const [stats, setStats] = useState(null);
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

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getStats(apiFilters);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [apiFilters]);

  // Fetch data when filters change
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh
  };
};