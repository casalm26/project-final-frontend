import { useEffect } from 'react';
import { useAuthStore } from '../../lib/stores/authStore';

export const AuthInitializer = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
};