import { useState, useEffect, useCallback, useMemo } from 'react';
import { treeAPI } from '../lib/api';
import { transformFiltersForAPI } from '../utils/filterTransformer';

export const useTreeData = (filters = {}) => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform filters to API format and memoize
  const apiFilters = useMemo(() => {
    const transformed = transformFiltersForAPI(filters);
    // Preserve pagination params that aren't part of the transformation
    if (filters.page) transformed.page = filters.page;
    if (filters.limit) transformed.limit = filters.limit;
    return transformed;
  }, [
    filters?.dateRange?.startDate,
    filters?.dateRange?.endDate,
    filters?.selectedForests,
    filters?.species,
    filters?.page,
    filters?.limit
  ]);

  const fetchTrees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await treeAPI.getAll(apiFilters);
      setTrees(response.data || []);
    } catch (err) {
      console.error('Error fetching tree data:', err);
      setError(err.message || 'Failed to fetch tree data');
    } finally {
      setLoading(false);
    }
  }, [apiFilters]);

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