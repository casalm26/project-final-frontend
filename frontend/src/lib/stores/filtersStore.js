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
        
        setFilters: (newFilters) => set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
        
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
        partialize: (state) => ({ filters: state.filters })
      }
    ),
    { name: 'filters-store' }
  )
);