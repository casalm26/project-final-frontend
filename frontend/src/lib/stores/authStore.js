import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authAPI } from '../api';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        
        // Initialize auth state from localStorage
        initializeAuth: () => {
          const token = localStorage.getItem('authToken');
          const userData = localStorage.getItem('userData');
          
          if (token && userData) {
            try {
              const user = JSON.parse(userData);
              set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              console.error('Error parsing user data:', error);
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        },
        
        login: async (email, password, onRetry) => {
          try {
            set({ isLoading: true });
            const response = await authAPI.login({ email, password }, { onRetry });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            set({
              user: userData,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true };
          } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
        },
        
        register: async (email, password, confirmPassword) => {
          try {
            set({ isLoading: true });
            
            if (password !== confirmPassword) {
              throw new Error('Passwords do not match');
            }
            
            const response = await authAPI.register({ email, password });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            set({
              user: userData,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true };
          } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
        },
        
        logout: async () => {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error('Logout API call failed:', error);
          } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },
        
        isAdmin: () => {
          const { user } = get();
          return user?.role === 'admin';
        },
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        updateUser: (userData) => {
          localStorage.setItem('userData', JSON.stringify(userData));
          set({ user: userData });
        },
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