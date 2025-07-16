import { useState, useEffect, useCallback, useMemo } from 'react';
import { treeAPI } from '../lib/api';

export const useTreeData = (filters = {}) => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters?.forestId,
    filters?.startDate,
    filters?.endDate,
    filters?.species,
    filters?.page,
    filters?.limit
  ]);

  const fetchTrees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await treeAPI.getAll(memoizedFilters);
      setTrees(response.data || []);
    } catch (err) {
      console.error('Error fetching tree data:', err);
      setError(err.message || 'Failed to fetch tree data');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const refresh = useCallback(() => {
    fetchTrees();
  }, [fetchTrees]);

  return {
    trees,
    loading,
    error,
    refresh
  };
};