import styled, { keyframes, css } from 'styled-components';
import { getToastColor } from '../../constants/toastTheme';

export const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
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

export const ToastWrapper = styled.div`
  ${({ $isExiting }) => css`
    animation: ${$isExiting ? slideOut : slideIn} 0.3s ease-out;
  `}
`;

export const ToastCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${({ $type }) => getToastColor($type)};
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  
  &:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

export const ToastContent = styled.div`
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

export const CloseButton = styled.button`
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

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${({ $type }) => getToastColor($type)};
  border-radius: 0 0 8px 8px;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.1s linear;
`;