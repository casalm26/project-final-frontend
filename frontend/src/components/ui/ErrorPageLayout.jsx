import React from 'react';
import { Button } from './Button';
import { useErrorPageNavigation } from '@/hooks/useErrorPageNavigation';

// Simple icons to replace deleted components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export const ErrorPageLayout = ({ 
  code, 
  title, 
  message, 
  illustration, 
  showBackButton = true,
  showHomeButton = true,
  showReloadButton = false,
  className,
  ...props 
}) => {
  const { goBack, goHome, reload } = useErrorPageNavigation();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 ${className}`} {...props}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {illustration}
        </div>
        
        <div className="text-6xl font-bold text-gray-800 mb-4">{code}</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex justify-center gap-4 flex-wrap mt-8">
          {showBackButton && (
            <Button onClick={goBack} variant="primary" className="flex items-center gap-2">
              <BackIcon className="w-4 h-4" />
              Go Back
            </Button>
          )}
          
          {showReloadButton && (
            <Button onClick={reload} variant="primary" className="flex items-center gap-2">
              <RefreshIcon className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button onClick={goHome} variant="secondary" className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};