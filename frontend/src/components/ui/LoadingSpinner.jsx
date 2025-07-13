import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
  
  ${({ fullscreen }) => fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
    min-height: 100vh;
  `}
`;

const Spinner = styled.div`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;

const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = '40px', 
  fullscreen = false,
  className = ''
}) => {
  return (
    <LoadingContainer 
      fullscreen={fullscreen} 
      className={className}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Spinner size={size} />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner; 