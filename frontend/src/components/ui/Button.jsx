import React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  link: 'btn-link',
  destructive: 'btn-destructive',
  success: 'btn-success',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-8',
  xl: 'h-14 px-10 text-lg',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    loading = false,
    type = 'button',
    children,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'btn',
          buttonVariants[variant],
          buttonSizes[size],
          disabled && 'btn-disabled',
          loading && 'btn-loading',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {loading && (
          <span className="btn-spinner" aria-hidden="true" role="img">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 