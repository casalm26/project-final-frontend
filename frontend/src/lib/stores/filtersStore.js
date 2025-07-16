import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useFiltersStore = create(
  devtools(
    (set, get) => ({
      filters: {
        dateRange: { start: null, end: null },
        forests: [],
        regions: [],
      },
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      clearFilters: () => set({
        filters: {
          dateRange: { start: null, end: null },
          forests: [],
          regions: [],
        }
      }),
      
      // Specific filter setters for convenience
      setDateRange: (dateRange) => set((state) => ({
        filters: { ...state.filters, dateRange }
      })),
      
      setForestFilter: (forests) => set((state) => ({
        filters: { ...state.filters, forests }
      })),
      
      setRegionFilter: (regions) => set((state) => ({
        filters: { ...state.filters, regions }
      })),
    }),
    { name: 'filters-store' }
  )
);