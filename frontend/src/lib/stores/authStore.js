import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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