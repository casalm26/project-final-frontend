import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useDataStore = create(
  devtools(
    (set, get) => ({
      forests: [],
      trees: [],
      loading: false,
      error: null,
      
      setForests: (forests) => set({ forests }),
      setTrees: (trees) => set({ trees }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Convenience methods for data management
      addForest: (forest) => set((state) => ({
        forests: [...state.forests, forest]
      })),
      
      updateForest: (forestId, updatedForest) => set((state) => ({
        forests: state.forests.map(f => 
          f.id === forestId ? { ...f, ...updatedForest } : f
        )
      })),
      
      removeForest: (forestId) => set((state) => ({
        forests: state.forests.filter(f => f.id !== forestId)
      })),
      
      addTree: (tree) => set((state) => ({
        trees: [...state.trees, tree]
      })),
      
      updateTree: (treeId, updatedTree) => set((state) => ({
        trees: state.trees.map(t => 
          t.id === treeId ? { ...t, ...updatedTree } : t
        )
      })),
      
      removeTree: (treeId) => set((state) => ({
        trees: state.trees.filter(t => t.id !== treeId)
      })),
    }),
    { name: 'data-store' }
  )
);