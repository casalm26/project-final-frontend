import { useState, useEffect } from 'react';

// Custom hook for performance metrics monitoring
export const usePerformanceMetrics = (updateInterval = 5000) => {
  const [metrics, setMetrics] = useState({});
  const [isSupported] = useState(
    typeof window !== 'undefined' && 'performance' in window
  );

  useEffect(() => {
    if (!isSupported) return;

    // Import performance monitor dynamically to avoid issues during SSR
    const updateMetrics = async () => {
      try {
        const { default: performanceMonitor } = await import('../utils/performance.js');
        setMetrics(performanceMonitor.getMetrics());
      } catch (error) {
        console.warn('Failed to update performance metrics:', error);
      }
    };

    // Initial update
    updateMetrics();

    // Set up interval for periodic updates
    const interval = setInterval(updateMetrics, updateInterval);

    return () => clearInterval(interval);
  }, [isSupported, updateInterval]);

  return { metrics, isSupported };
};