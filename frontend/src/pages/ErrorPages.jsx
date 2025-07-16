import React from 'react';
import { ErrorPageLayout, NotFoundIllustration, ServerErrorIllustration } from '@/components/ui';

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