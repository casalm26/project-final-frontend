import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { forestAPI } from '../api';

export const useForestStore = create(
  devtools(
    (set, get) => ({
      forests: [],
      selectedForest: null,
      loading: false,
      error: null,
      analytics: {},
      
      // Basic state setters
      setForests: (forests) => set({ forests }),
      setSelectedForest: (forest) => set({ selectedForest: forest }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Forest CRUD operations
      createForest: async (forestData) => {
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.create(forestData);
          const newForest = response.data;
          
          set((state) => ({
            forests: [newForest, ...state.forests],
            loading: false
          }));
          
          return newForest;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updateForest: async (forestId, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.update(forestId, updates);
          const updatedForest = response.data;
          
          set((state) => ({
            forests: state.forests.map(f => 
              (f._id || f.id) === forestId ? updatedForest : f
            ),
            selectedForest: state.selectedForest && (state.selectedForest._id || state.selectedForest.id) === forestId 
              ? updatedForest 
              : state.selectedForest,
            loading: false
          }));
          
          return updatedForest;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      deleteForest: async (forestId) => {
        set({ loading: true, error: null });
        try {
          await forestAPI.delete(forestId);
          
          set((state) => ({
            forests: state.forests.filter(f => (f._id || f.id) !== forestId),
            selectedForest: state.selectedForest && (state.selectedForest._id || state.selectedForest.id) === forestId 
              ? null 
              : state.selectedForest,
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Fetch forests
      fetchForests: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.getAll(params);
          const forests = response.data?.forests || response.data || [];
          
          set({
            forests,
            loading: false
          });
          
          return forests;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchForestById: async (forestId) => {
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.getById(forestId);
          const forest = response.data;
          
          set((state) => ({
            selectedForest: forest,
            forests: state.forests.map(f => 
              (f._id || f.id) === forestId ? forest : f
            ),
            loading: false
          }));
          
          return forest;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Analytics
      fetchForestAnalytics: async (forestId, force = false) => {
        const state = get();
        if (!force && state.analytics[forestId]) {
          return state.analytics[forestId];
        }
        
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.getAnalytics(forestId);
          const analytics = response.data;
          
          set((state) => ({
            analytics: {
              ...state.analytics,
              [forestId]: analytics
            },
            loading: false
          }));
          
          return analytics;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Utility methods
      getForestById: (forestId) => {
        return get().forests.find(f => (f._id || f.id) === forestId);
      },
      
      getForestsByRegion: (region) => {
        if (!region) return get().forests;
        return get().forests.filter(f => f.region === region);
      },
      
      searchForests: (query) => {
        if (!query.trim()) return get().forests;
        const lowerQuery = query.toLowerCase();
        return get().forests.filter(f => 
          f.name.toLowerCase().includes(lowerQuery) ||
          f.region.toLowerCase().includes(lowerQuery) ||
          (f.description && f.description.toLowerCase().includes(lowerQuery))
        );
      },
      
      // Get unique regions
      getRegions: () => {
        const forests = get().forests;
        return [...new Set(forests.map(f => f.region).filter(Boolean))];
      },
      
      // Statistics
      getForestStats: () => {
        const forests = get().forests;
        const total = forests.length;
        const totalArea = forests.reduce((sum, f) => sum + (f.area || 0), 0);
        
        const regionCount = forests.reduce((acc, forest) => {
          if (forest.region) {
            acc[forest.region] = (acc[forest.region] || 0) + 1;
          }
          return acc;
        }, {});
        
        return {
          total,
          totalArea,
          regionCount,
          averageArea: total > 0 ? totalArea / total : 0
        };
      },
      
      // Get forest options for selects
      getForestOptions: () => {
        return get().forests.map(f => ({
          value: f._id || f.id,
          label: f.name
        }));
      },
      
      // Reset store
      reset: () => set({
        forests: [],
        selectedForest: null,
        loading: false,
        error: null,
        analytics: {}
      })
    }),
    { name: 'forest-store' }
  )
);