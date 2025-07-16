import React from 'react';
import { cn } from '@/lib/utils';
import { ErrorCard, ErrorTitle, ErrorMessage, ErrorDetails } from './ErrorCard';
import { ErrorActions } from './ErrorActions';
import { useErrorReporting } from '../../hooks/useErrorReporting';
import { formatDateTimeForAPI } from '@utils/dateUtils';

const ErrorContainer = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-8 bg-gray-50',
        className
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      {children}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
    
    // Initialize error reporting utilities
    this.errorReporting = {
      reportError: (error, errorInfo) => {
        const errorData = {
          error: error?.toString(),
          stack: error?.stack,
          componentStack: errorInfo?.componentStack,
          userAgent: navigator.userAgent,
          timestamp: formatDateTimeForAPI(new Date()),
          url: window.location.href
        };

        navigator.clipboard.writeText(JSON.stringify(errorData, null, 2))
          .then(() => {
            alert('Error details copied to clipboard. Please send this to support.');
          })
          .catch(() => {
            alert('Failed to copy error details. Please try again.');
          });
      },
      logError: (error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // TODO: In production, you might want to send this to an error reporting service
      }
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

    this.errorReporting.logError(error, errorInfo);
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
    this.errorReporting.reportError(this.state.error, this.state.errorInfo);
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. You can try refreshing the page 
              or contact support if the problem persists.
            </ErrorMessage>
            
            {this.state.error && (
              <ErrorDetails 
                error={this.state.error} 
                errorInfo={this.state.errorInfo} 
              />
            )}
            
            <ErrorActions
              onRetry={this.handleRetry}
              onReload={this.handleReload}
              onReportError={this.handleReportError}
            />
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 