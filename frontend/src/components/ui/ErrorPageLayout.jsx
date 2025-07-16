import React from 'react';
import { 
  ErrorPageContainer, 
  ErrorPageCard, 
  ErrorPageIllustration, 
  ErrorPageCode, 
  ErrorPageTitle, 
  ErrorPageMessage,
  Button,
  ButtonGroup,
  BackIcon,
  HomeIcon,
  RefreshIcon
} from './';
import { useErrorPageNavigation } from '@/hooks/useErrorPageNavigation';

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
    <ErrorPageContainer className={className} {...props}>
      <ErrorPageCard>
        <ErrorPageIllustration>
          {illustration}
        </ErrorPageIllustration>
        
        <ErrorPageCode>{code}</ErrorPageCode>
        <ErrorPageTitle>{title}</ErrorPageTitle>
        <ErrorPageMessage>{message}</ErrorPageMessage>
        
        <ButtonGroup className="flex justify-center gap-4 flex-wrap mt-8">
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
        </ButtonGroup>
      </ErrorPageCard>
    </ErrorPageContainer>
  );
};