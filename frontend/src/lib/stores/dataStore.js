import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { forestAPI, treeAPI } from '../api';

export const useDataStore = create(
  devtools(
    (set, get) => ({
      forests: [],
      trees: [],
      loading: false,
      error: null,
      lastFetch: {
        forests: null,
        trees: null
      },
      
      // Basic setters
      setForests: (forests) => set({ forests, lastFetch: { ...get().lastFetch, forests: Date.now() } }),
      setTrees: (trees) => set({ trees, lastFetch: { ...get().lastFetch, trees: Date.now() } }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Async data fetchers with caching
      fetchForests: async (force = false) => {
        const state = get();
        const cacheAge = Date.now() - (state.lastFetch.forests || 0);
        const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes
        
        if (!force && state.forests.length > 0 && cacheValid) {
          return state.forests;
        }
        
        set({ loading: true, error: null });
        try {
          const response = await forestAPI.getAll();
          const forests = response.data?.forests || response.data || [];
          set({ 
            forests, 
            loading: false,
            lastFetch: { ...state.lastFetch, forests: Date.now() }
          });
          return forests;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchTrees: async (params = {}, force = false) => {
        const state = get();
        const cacheAge = Date.now() - (state.lastFetch.trees || 0);
        const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes
        
        if (!force && state.trees.length > 0 && cacheValid && Object.keys(params).length === 0) {
          return state.trees;
        }
        
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.getAll(params);
          const trees = response.data?.trees || response.data || [];
          set({ 
            trees, 
            loading: false,
            lastFetch: { ...state.lastFetch, trees: Date.now() }
          });
          return trees;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Forest management
      addForest: (forest) => set((state) => ({
        forests: [...state.forests, forest]
      })),
      
      updateForest: (forestId, updatedForest) => set((state) => ({
        forests: state.forests.map(f => 
          (f._id || f.id) === forestId ? { ...f, ...updatedForest } : f
        )
      })),
      
      removeForest: (forestId) => set((state) => ({
        forests: state.forests.filter(f => (f._id || f.id) !== forestId)
      })),
      
      // Tree management
      addTree: (tree) => set((state) => ({
        trees: [...state.trees, tree]
      })),
      
      updateTree: (treeId, updatedTree) => set((state) => ({
        trees: state.trees.map(t => 
          (t._id || t.id) === treeId ? { ...t, ...updatedTree } : t
        )
      })),
      
      removeTree: (treeId) => set((state) => ({
        trees: state.trees.filter(t => (t._id || t.id) !== treeId)
      })),
      
      // Utility methods
      getForestById: (forestId) => {
        return get().forests.find(f => (f._id || f.id) === forestId);
      },
      
      getTreeById: (treeId) => {
        return get().trees.find(t => (t._id || t.id) === treeId);
      },
      
      getTreesByForest: (forestId) => {
        return get().trees.filter(t => {
          const treeForestId = t.forestId?._id || t.forestId;
          return treeForestId === forestId;
        });
      },
      
      // Clear cache
      clearCache: () => set({
        lastFetch: { forests: null, trees: null }
      }),
      
      // Reset store
      reset: () => set({
        forests: [],
        trees: [],
        loading: false,
        error: null,
        lastFetch: { forests: null, trees: null }
      })
    }),
    { name: 'data-store' }
  )
);