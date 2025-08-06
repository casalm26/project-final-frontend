import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { treeAPI } from '../api';

export const useTreeStore = create(
  devtools(
    (set, get) => ({
      trees: [],
      selectedTree: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      },
      measurements: {},
      
      // Basic state setters
      setTrees: (trees) => set({ trees }),
      setSelectedTree: (tree) => set({ selectedTree: tree }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setPagination: (pagination) => set({ pagination }),
      
      // Tree CRUD operations
      createTree: async (treeData) => {
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.create(treeData);
          const newTree = response.data;
          
          set((state) => ({
            trees: [newTree, ...state.trees],
            loading: false
          }));
          
          return newTree;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updateTree: async (treeId, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.update(treeId, updates);
          const updatedTree = response.data;
          
          set((state) => ({
            trees: state.trees.map(t => 
              (t._id || t.id) === treeId ? updatedTree : t
            ),
            selectedTree: state.selectedTree && (state.selectedTree._id || state.selectedTree.id) === treeId 
              ? updatedTree 
              : state.selectedTree,
            loading: false
          }));
          
          return updatedTree;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      deleteTree: async (treeId) => {
        set({ loading: true, error: null });
        try {
          await treeAPI.delete(treeId);
          
          set((state) => ({
            trees: state.trees.filter(t => (t._id || t.id) !== treeId),
            selectedTree: state.selectedTree && (state.selectedTree._id || state.selectedTree.id) === treeId 
              ? null 
              : state.selectedTree,
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      markTreeDead: async (treeId, reason) => {
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.markDead(treeId, { reason });
          const updatedTree = response.data;
          
          set((state) => ({
            trees: state.trees.map(t => 
              (t._id || t.id) === treeId ? updatedTree : t
            ),
            selectedTree: state.selectedTree && (state.selectedTree._id || state.selectedTree.id) === treeId 
              ? updatedTree 
              : state.selectedTree,
            loading: false
          }));
          
          return updatedTree;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Measurement operations
      addMeasurement: async (treeId, measurementData) => {
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.addMeasurement(treeId, measurementData);
          const updatedTree = response.data;
          
          set((state) => ({
            trees: state.trees.map(t => 
              (t._id || t.id) === treeId ? updatedTree : t
            ),
            selectedTree: state.selectedTree && (state.selectedTree._id || state.selectedTree.id) === treeId 
              ? updatedTree 
              : state.selectedTree,
            loading: false
          }));
          
          return updatedTree;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchTreeMeasurements: async (treeId, force = false) => {
        const state = get();
        if (!force && state.measurements[treeId]) {
          return state.measurements[treeId];
        }
        
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.getMeasurements(treeId);
          const measurements = response.data;
          
          set((state) => ({
            measurements: {
              ...state.measurements,
              [treeId]: measurements
            },
            loading: false
          }));
          
          return measurements;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Fetching trees with filters and pagination
      fetchTrees: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await treeAPI.getAll({
            page: params.page || get().pagination.page,
            limit: params.limit || get().pagination.limit,
            ...params
          });
          
          const { trees, pagination } = response.data;
          
          set({
            trees: trees || [],
            pagination: pagination || get().pagination,
            loading: false
          });
          
          return { trees, pagination };
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Utility methods
      getTreeById: (treeId) => {
        return get().trees.find(t => (t._id || t.id) === treeId);
      },
      
      getTreesByForest: (forestId) => {
        return get().trees.filter(t => {
          const treeForestId = t.forestId?._id || t.forestId;
          return treeForestId === forestId;
        });
      },
      
      getTreesByStatus: (status) => {
        if (status === 'all') return get().trees;
        const isAlive = status === 'alive';
        return get().trees.filter(t => t.status === (isAlive ? 'alive' : 'dead'));
      },
      
      getTreesBySpecies: (species) => {
        if (!species || species.length === 0) return get().trees;
        return get().trees.filter(t => species.includes(t.species));
      },
      
      searchTrees: (query) => {
        if (!query.trim()) return get().trees;
        const lowerQuery = query.toLowerCase();
        return get().trees.filter(t => 
          t.treeId.toLowerCase().includes(lowerQuery) ||
          t.species.toLowerCase().includes(lowerQuery) ||
          (t.metadata?.notes && t.metadata.notes.toLowerCase().includes(lowerQuery))
        );
      },
      
      // Statistics
      getTreeStats: () => {
        const trees = get().trees;
        const alive = trees.filter(t => t.status === 'alive').length;
        const dead = trees.filter(t => t.status === 'dead').length;
        const total = trees.length;
        
        const speciesCount = trees.reduce((acc, tree) => {
          acc[tree.species] = (acc[tree.species] || 0) + 1;
          return acc;
        }, {});
        
        return {
          total,
          alive,
          dead,
          survivalRate: total > 0 ? (alive / total) * 100 : 0,
          speciesCount
        };
      },
      
      // Reset store
      reset: () => set({
        trees: [],
        selectedTree: null,
        loading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        measurements: {}
      })
    }),
    { name: 'tree-store' }
  )
);