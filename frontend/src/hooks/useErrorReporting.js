import { useCallback } from 'react';
import { formatDateTimeForAPI } from '@/utils/dateUtils';

export const useErrorReporting = () => {
  const reportError = useCallback((error, errorInfo) => {
    const errorData = {
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: formatDateTimeForAPI(new Date()),
      url: window.location.href
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please send this to support.');
      })
      .catch(() => {
        alert('Failed to copy error details. Please try again.');
      });
  }, []);

  const logError = useCallback((error, errorInfo) => {
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // TODO: In production, you might want to send this to an error reporting service
    // reportError(error, errorInfo);
  }, []);

  return { reportError, logError };
};