import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useColdStartDetection } from './useColdStartDetection';

export const useLogin = () => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    connectionState,
    handleRetry,
    startConnection,
    connectionSuccess,
    connectionFailed,
    resetConnection
  } = useColdStartDetection();

  const handleLogin = async (formData) => {
    setIsSubmitting(true);
    setErrors({});
    startConnection();
    
    try {
      const result = await login(formData.email, formData.password, handleRetry);
      
      if (result.success) {
        connectionSuccess();
        // Navigation will be handled by the auth context
      } else {
        connectionFailed(new Error(result.error));
        setErrors({ general: result.error });
      }
    } catch (error) {
      connectionFailed(error);
      setErrors({ general: 'Connection failed. Please check your internet connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConnection = () => {
    resetConnection();
    setIsSubmitting(false);
  };

  return {
    errors,
    isSubmitting,
    connectionState,
    handleLogin,
    handleCancelConnection
  };
};

// Authentication now uses Zustand store for better state management