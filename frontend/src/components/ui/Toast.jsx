import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ToastIcon } from './ToastIcon';
import { useToastTimer } from '../../hooks/useToastTimer';
import { getToastTitle } from '../../constants/toastTheme';
import {
  ToastContainer,
  ToastWrapper,
  ToastCard,
  ToastContent,
  CloseButton,
  ProgressBar
} from './Toast.styles';


const Toast = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const progress = useToastTimer(toast.duration);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };


  return (
    <ToastWrapper $isExiting={isExiting}>
      <ToastCard 
        $type={toast.type}
        role="alert"
        aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        <ToastIcon type={toast.type} />
        
        <ToastContent>
          <h4>{toast.title || getToastTitle(toast.type)}</h4>
          <p>{toast.message}</p>
        </ToastContent>
        
        <CloseButton 
          onClick={handleClose}
          aria-label="Close notification"
          type="button"
        >
          <svg viewBox="0 0 20 20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </CloseButton>
        
        {toast.duration > 0 && (
          <ProgressBar $type={toast.type} $progress={progress} />
        )}
      </ToastCard>
    </ToastWrapper>
  );
};

export const ToastNotifications = () => {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainer role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={removeToast}
        />
      ))}
    </ToastContainer>
  );
};

export default Toast; 