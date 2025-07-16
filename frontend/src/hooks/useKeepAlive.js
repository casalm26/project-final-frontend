import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { KEEP_ALIVE_CONFIG } from '../constants/keepAliveConstants';

export const useKeepAlive = () => {
  const { user } = useAuth();
  const intervalRef = useRef(null);
  const isEnabled = import.meta.env.VITE_ENV === 'production' 
    ? KEEP_ALIVE_CONFIG.enabledInProduction 
    : KEEP_ALIVE_CONFIG.enabledInDevelopment;

  useEffect(() => {
    // Only start keep-alive if user is authenticated and feature is enabled
    if (!user || !isEnabled) {
      return;
    }

    const performKeepAlive = async () => {
      try {
        // Make a lightweight request to keep the server warm using existing API client
        await api.auth.getProfile();
        console.log('Keep-alive ping successful');
      } catch (error) {
        // Silently fail - this is just a keep-alive, not critical
        console.log('Keep-alive ping error:', error.message);
      }
    };

    // Start the keep-alive interval
    intervalRef.current = setInterval(performKeepAlive, KEEP_ALIVE_CONFIG.intervalMs);

    // Cleanup on unmount or when user logs out
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, isEnabled]);

  // Manual keep-alive trigger (can be used by components)
  const triggerKeepAlive = async () => {
    if (!user || !isEnabled) return false;

    try {
      await api.auth.getProfile();
      return true;
    } catch (error) {
      console.log('Manual keep-alive failed:', error.message);
      return false;
    }
  };

  return {
    triggerKeepAlive,
    isEnabled,
  };
};

export default useKeepAlive;