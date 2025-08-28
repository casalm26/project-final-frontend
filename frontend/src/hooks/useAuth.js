import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/stores/authStore';

/**
 * Compatibility hook that provides the same API as AuthContext
 * but uses the Zustand authStore internally
 */
export const useAuth = () => {
  const navigate = useNavigate();
  
  // Get all auth state and actions from the store
  const {
    user,
    isAuthenticated,
    isLoading: loading,
    initializeAuth,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    isAdmin: getIsAdmin,
  } = useAuthStore();

  // Initialize auth on first load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Wrapped login function that handles navigation
  const login = async (email, password, onRetry) => {
    const result = await storeLogin(email, password, onRetry);
    if (result.success) {
      navigate('/dashboard');
    }
    return result;
  };

  // Wrapped register function that handles navigation
  const register = async (email, password, confirmPassword) => {
    const result = await storeRegister(email, password, confirmPassword);
    if (result.success) {
      navigate('/dashboard');
    }
    return result;
  };

  // Wrapped logout function that handles navigation
  const logout = async () => {
    await storeLogout();
    navigate('/');
  };

  // Wrapped isAdmin function
  const isAdmin = () => getIsAdmin();

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated, // Additional property not in original AuthContext
  };
};