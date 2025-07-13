import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorDetails = styled.details`
  margin-bottom: 2rem;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: #007bff;
    font-weight: 500;
    margin-bottom: 0.5rem;
    
    &:hover {
      color: #0056b3;
    }
  }
`;

const ErrorCode = styled.pre`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
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
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportError = () => {
    const errorData = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please send this to support.');
      })
      .catch(() => {
        alert('Failed to copy error details. Please try again.');
      });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer role="alert" aria-live="assertive">
          <ErrorCard>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. You can try refreshing the page 
              or contact support if the problem persists.
            </ErrorMessage>
            
            {this.state.error && (
              <ErrorDetails>
                <summary>Show technical details</summary>
                <ErrorCode>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </ErrorCode>
              </ErrorDetails>
            )}
            
            <ButtonGroup>
              <PrimaryButton onClick={this.handleRetry}>
                Try Again
              </PrimaryButton>
              <SecondaryButton onClick={this.handleReload}>
                Refresh Page
              </SecondaryButton>
              <SecondaryButton onClick={this.handleReportError}>
                Report Error
              </SecondaryButton>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 