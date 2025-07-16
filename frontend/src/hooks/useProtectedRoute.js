import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for protected route logic
 * Returns authentication state and helper functions
 */
export const useProtectedRoute = () => {
  const { user, loading } = useAuth();

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading
  };
};