import { useState, useCallback } from 'react';

export const useColdStartDetection = () => {
  const [connectionState, setConnectionState] = useState({
    isConnecting: false,
    isColdStart: false,
    retryAttempt: 0,
    totalAttempts: 0,
    estimatedWaitTime: 0,
    message: '',
    error: null
  });

  const handleRetry = useCallback((retryInfo) => {
    const { attempt, totalAttempts, delay, error, isColdStart } = retryInfo;
    
    setConnectionState(prev => ({
      ...prev,
      isConnecting: true,
      isColdStart,
      retryAttempt: attempt,
      totalAttempts,
      estimatedWaitTime: Math.ceil(delay / 1000),
      message: getRetryMessage(attempt, totalAttempts, isColdStart),
      error: null
    }));
  }, []);

  const startConnection = useCallback(() => {
    setConnectionState({
      isConnecting: true,
      isColdStart: false,
      retryAttempt: 0,
      totalAttempts: 0,
      estimatedWaitTime: 10,
      message: 'Connecting to server...',
      error: null
    });
  }, []);

  const connectionSuccess = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      isColdStart: false,
      retryAttempt: 0,
      totalAttempts: 0,
      estimatedWaitTime: 0,
      message: 'Connected successfully!',
      error: null
    });
  }, []);

  const connectionFailed = useCallback((error) => {
    setConnectionState(prev => ({
      ...prev,
      isConnecting: false,
      error: error.message || 'Connection failed',
      message: 'Connection failed. Please try again.'
    }));
  }, []);

  const resetConnection = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      isColdStart: false,
      retryAttempt: 0,
      totalAttempts: 0,
      estimatedWaitTime: 0,
      message: '',
      error: null
    });
  }, []);

  return {
    connectionState,
    handleRetry,
    startConnection,
    connectionSuccess,
    connectionFailed,
    resetConnection
  };
};

const getRetryMessage = (attempt, totalAttempts, isColdStart) => {
  if (attempt === 1 && isColdStart) {
    return 'Server is starting up, this may take up to 60 seconds...';
  }
  
  if (attempt === 2 && isColdStart) {
    return 'Still starting up, please wait...';
  }
  
  if (attempt === 3 && isColdStart) {
    return 'Almost ready, just a few more seconds...';
  }
  
  if (attempt >= 4 && isColdStart) {
    return 'Final attempt, server should be ready soon...';
  }
  
  return `Retrying connection (${attempt}/${totalAttempts})...`;
};

export default useColdStartDetection;