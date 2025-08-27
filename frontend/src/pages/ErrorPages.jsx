import React from 'react';
import { ErrorPageLayout } from '@/components/ui';

// Simple illustration components to replace deleted ones
const NotFoundIllustration = () => (
  <div className="flex items-center justify-center w-32 h-32 mx-auto bg-gray-100 rounded-full">
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.5-2.709" />
    </svg>
  </div>
);

const ServerErrorIllustration = () => (
  <div className="flex items-center justify-center w-32 h-32 mx-auto bg-red-100 rounded-full">
    <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.994-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  </div>
);

export const NotFoundPage = () => {
  return (
    <ErrorPageLayout
      code="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      illustration={<NotFoundIllustration />}
      showBackButton={true}
      showHomeButton={true}
      showReloadButton={false}
    />
  );
};

export const ServerErrorPage = () => {
  return (
    <ErrorPageLayout
      code="500"
      title="Internal Server Error"
      message="Something went wrong on our end. We're working to fix it. Please try again in a few moments."
      illustration={<ServerErrorIllustration />}
      showBackButton={false}
      showHomeButton={true}
      showReloadButton={true}
    />
  );
}; 