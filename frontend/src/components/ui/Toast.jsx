import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useToast } from '../../contexts/ToastContext';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 420px;
  
  @media (max-width: 768px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`;

const ToastWrapper = styled.div`
  ${({ isExiting }) => css`
    animation: ${isExiting ? slideOut : slideIn} 0.3s ease-out;
  `}
`;

const ToastCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${({ type }) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#17a2b8';
    }
  }};
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  
  &:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const ToastIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 0.125rem;
  
  svg {
    width: 100%;
    height: 100%;
    fill: ${({ type }) => {
      switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        case 'info': return '#17a2b8';
        default: return '#17a2b8';
      }
    }};
  }
`;

const ToastContent = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    color: #666;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #999;
  flex-shrink: 0;
  border-radius: 4px;
  
  &:hover {
    color: #666;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#17a2b8';
    }
  }};
  border-radius: 0 0 8px 8px;
  width: ${({ progress }) => progress}%;
  transition: width 0.1s linear;
`;

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg viewBox="0 0 20 20">
          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
        </svg>
      );
  }
};

const Toast = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (toast.duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getTitle = (type) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  };

  return (
    <ToastWrapper isExiting={isExiting}>
      <ToastCard 
        type={toast.type}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <ToastIcon type={toast.type}>
          {getToastIcon(toast.type)}
        </ToastIcon>
        
        <ToastContent>
          <h4>{toast.title || getTitle(toast.type)}</h4>
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
          <ProgressBar type={toast.type} progress={progress} />
        )}
      </ToastCard>
    </ToastWrapper>
  );
};

export const ToastNotifications = () => {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainer aria-live="polite" aria-label="Notifications">
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