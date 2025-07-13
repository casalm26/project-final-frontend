import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ToastContext = createContext();

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.id);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    
    dispatch({ type: 'ADD_TOAST', toast: newToast });
    
    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
      }, newToast.duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({ message, type: 'error', duration: 7000, ...options });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({ message, type: 'warning', duration: 6000, ...options });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 