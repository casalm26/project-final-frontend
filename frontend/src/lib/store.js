import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Auth store
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        
        login: (userData, token) => {
          localStorage.setItem('authToken', token);
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        },
        
        logout: () => {
          localStorage.removeItem('authToken');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        updateUser: (userData) => set({ user: userData }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// App store for global state
export const useAppStore = create(
  devtools(
    (set, get) => ({
      // Global filters
      filters: {
        dateRange: { start: null, end: null },
        forests: [],
        regions: [],
      },
      
      // UI state
      sidebarOpen: false,
      darkMode: false,
      
      // Data
      forests: [],
      trees: [],
      loading: false,
      error: null,
      
      // Actions
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
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setDarkMode: (dark) => {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ darkMode: dark });
      },
      
      setForests: (forests) => set({ forests }),
      setTrees: (trees) => set({ trees }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'app-store' }
  )
); 