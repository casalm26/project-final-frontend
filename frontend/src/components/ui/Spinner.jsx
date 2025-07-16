import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerElement = styled.div`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ color }) => color && `
    border-top-color: ${color};
  `}
`;

export const Spinner = ({ 
  size = '40px', 
  color = '#007bff',
  className = '',
  ...props 
}) => {
  return (
    <SpinnerElement 
      size={size} 
      color={color}
      className={className}
      {...props}
    />
  );
};