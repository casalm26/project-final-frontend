import React from 'react';
import { Button } from './Button';

export const LoadingButton = React.forwardRef(
  ({ 
    loading, 
    loadingText = 'Loading...',
    children,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        loading={loading}
        {...props}
      >
        {loading ? loadingText : children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';