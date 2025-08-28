import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useFiltersStore = create(
  devtools(
    persist(
      (set, get) => ({
        filters: {
          dateRange: { start: null, end: null },
          forests: [],
          regions: [],
          species: [],
          status: 'all', // 'all', 'alive', 'dead'
          soilCondition: '',
          sunlightExposure: '',
          search: ''
        },
        
        setFilters: (newFilters) => set((state) => {
          // Ensure we maintain the structure for dateRange
          const updatedFilters = { ...state.filters, ...newFilters };
          if (updatedFilters.dateRange && typeof updatedFilters.dateRange === 'object') {
            updatedFilters.dateRange = {
              start: updatedFilters.dateRange.start || null,
              end: updatedFilters.dateRange.end || null
            };
          } else if (!updatedFilters.dateRange) {
            updatedFilters.dateRange = { start: null, end: null };
          }
          return { filters: updatedFilters };
        }),
        
        clearFilters: () => set({
          filters: {
            dateRange: { start: null, end: null },
            forests: [],
            regions: [],
            species: [],
            status: 'all',
            soilCondition: '',
            sunlightExposure: '',
            search: ''
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
        
        setSpeciesFilter: (species) => set((state) => ({
          filters: { ...state.filters, species }
        })),
        
        setStatusFilter: (status) => set((state) => ({
          filters: { ...state.filters, status }
        })),
        
        setSoilConditionFilter: (soilCondition) => set((state) => ({
          filters: { ...state.filters, soilCondition }
        })),
        
        setSunlightExposureFilter: (sunlightExposure) => set((state) => ({
          filters: { ...state.filters, sunlightExposure }
        })),
        
        setSearchFilter: (search) => set((state) => ({
          filters: { ...state.filters, search }
        })),
        
        // Utility methods
        getActiveFiltersCount: () => {
          const { filters } = get();
          let count = 0;
          
          if (filters.dateRange.start || filters.dateRange.end) count++;
          if (filters.forests.length > 0) count++;
          if (filters.regions.length > 0) count++;
          if (filters.species.length > 0) count++;
          if (filters.status !== 'all') count++;
          if (filters.soilCondition) count++;
          if (filters.sunlightExposure) count++;
          if (filters.search.trim()) count++;
          
          return count;
        },
        
        hasActiveFilters: () => {
          return get().getActiveFiltersCount() > 0;
        },
        
        // Generate API params from filters
        getApiParams: () => {
          const { filters } = get();
          const params = {};
          
          if (filters.dateRange.start) {
            params.startDate = filters.dateRange.start;
          }
          if (filters.dateRange.end) {
            params.endDate = filters.dateRange.end;
          }
          if (filters.forests.length > 0) {
            params.forestIds = filters.forests.join(',');
          }
          if (filters.regions.length > 0) {
            params.regions = filters.regions.join(',');
          }
          if (filters.species.length > 0) {
            params.species = filters.species.join(',');
          }
          if (filters.status !== 'all') {
            params.status = filters.status;
          }
          if (filters.soilCondition) {
            params.soilCondition = filters.soilCondition;
          }
          if (filters.sunlightExposure) {
            params.sunlightExposure = filters.sunlightExposure;
          }
          if (filters.search.trim()) {
            params.search = filters.search.trim();
          }
          
          return params;
        }
      }),
      {
        name: 'filters-storage',
        partialize: (state) => ({ filters: state.filters }),
        onRehydrateStorage: () => (state) => {
          // Ensure the rehydrated state has the correct structure
          if (state && state.filters) {
            if (!state.filters.dateRange || typeof state.filters.dateRange !== 'object') {
              state.filters.dateRange = { start: null, end: null };
            } else {
              // Ensure dateRange has both start and end properties
              state.filters.dateRange = {
                start: state.filters.dateRange.start || null,
                end: state.filters.dateRange.end || null
              };
            }
            // Ensure arrays exist
            state.filters.forests = state.filters.forests || [];
            state.filters.regions = state.filters.regions || [];
            state.filters.species = state.filters.species || [];
            // Ensure strings exist
            state.filters.status = state.filters.status || 'all';
            state.filters.soilCondition = state.filters.soilCondition || '';
            state.filters.sunlightExposure = state.filters.sunlightExposure || '';
            state.filters.search = state.filters.search || '';
          }
        }
      }
    ),
    { name: 'filters-store' }
  )
);