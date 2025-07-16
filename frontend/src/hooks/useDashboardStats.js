import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardAPI } from '../lib/api';

export const useDashboardStats = (filters = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters?.forestId,
    filters?.startDate,
    filters?.endDate,
    filters?.species
  ]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getStats(memoizedFilters);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

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