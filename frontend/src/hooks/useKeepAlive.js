import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Keep-alive configuration
const KEEP_ALIVE_CONFIG = {
  intervalMs: 10 * 60 * 1000, // 10 minutes
  endpoint: '/auth/profile', // Simple endpoint to keep server warm
  enabledInProduction: true,
  enabledInDevelopment: false,
};

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
        // Make a lightweight request to keep the server warm
        const response = await fetch(`${import.meta.env.VITE_API_URL}${KEEP_ALIVE_CONFIG.endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Keep-alive ping successful');
        } else {
          console.log('Keep-alive ping failed, but continuing...');
        }
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
    if (!user || !isEnabled) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${KEEP_ALIVE_CONFIG.endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
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