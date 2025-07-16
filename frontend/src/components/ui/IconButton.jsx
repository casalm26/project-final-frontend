import React from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export const IconButton = React.forwardRef(
  ({ 
    className, 
    children, 
    'aria-label': ariaLabel,
    size = 'md',
    variant = 'ghost',
    ...props 
  }, ref) => {
    return (
      <Button
        className={cn(
          'btn-icon',
          size === 'sm' && 'h-8 w-8',
          size === 'md' && 'h-10 w-10',
          size === 'lg' && 'h-12 w-12',
          className
        )}
        ref={ref}
        size="icon"
        variant={variant}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';