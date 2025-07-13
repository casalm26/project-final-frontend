import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  color: #dc3545;
  margin: 0;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 1.5rem 0 2rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  
  &:hover:not(:disabled) {
    background-color: #6c757d;
    color: white;
    transform: translateY(-2px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Illustration = styled.div`
  margin-bottom: 2rem;
  
  svg {
    width: 120px;
    height: 120px;
    opacity: 0.7;
    
    @media (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }
`;

const NotFoundIllustration = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M16 8l-8 8" />
    <path d="M8 8l8 8" />
  </svg>
);

const ServerErrorIllustration = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <path d="M12 6v6" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ErrorContainer>
      <ErrorCard>
        <Illustration>
          <NotFoundIllustration />
        </Illustration>
        
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>Page Not Found</ErrorTitle>
        <ErrorMessage>
          The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </ErrorMessage>
        
        <ButtonGroup>
          <PrimaryButton onClick={handleGoBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Go Back
          </PrimaryButton>
          
          <SecondaryButton onClick={handleGoHome}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Go Home
          </SecondaryButton>
        </ButtonGroup>
      </ErrorCard>
    </ErrorContainer>
  );
};

export const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ErrorContainer>
      <ErrorCard>
        <Illustration>
          <ServerErrorIllustration />
        </Illustration>
        
        <ErrorCode>500</ErrorCode>
        <ErrorTitle>Internal Server Error</ErrorTitle>
        <ErrorMessage>
          Something went wrong on our end. We're working to fix it. 
          Please try again in a few moments.
        </ErrorMessage>
        
        <ButtonGroup>
          <PrimaryButton onClick={handleReload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23,4 23,10 17,10" />
              <polyline points="1,20 1,14 7,14" />
              <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10" />
              <path d="M3.51,15A9,9,0,0,0,18.36,18.36L23,14" />
            </svg>
            Try Again
          </PrimaryButton>
          
          <SecondaryButton onClick={handleGoHome}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Go Home
          </SecondaryButton>
        </ButtonGroup>
      </ErrorCard>
    </ErrorContainer>
  );
}; 