import React from 'react';
import styled from 'styled-components';
import { Spinner } from './Spinner';

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

const SpinnerWrapper = styled.div`
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
  className = '',
  spinnerColor = '#007bff'
}) => {
  return (
    <LoadingContainer 
      fullscreen={fullscreen} 
      className={className}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <SpinnerWrapper>
        <Spinner size={size} color={spinnerColor} />
      </SpinnerWrapper>
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner; 