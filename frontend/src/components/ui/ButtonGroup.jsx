import React from 'react';
import { cn } from '@/lib/utils';

export const ButtonGroup = React.forwardRef(
  ({ 
    className, 
    orientation = 'horizontal',
    size = 'md',
    variant = 'outline',
    children,
    ...props 
  }, ref) => {
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          size: child.props.size || size,
          variant: child.props.variant || variant,
        });
      }
      return child;
    });

    return (
      <div
        className={cn(
          'btn-group',
          orientation === 'horizontal' && 'btn-group-horizontal',
          orientation === 'vertical' && 'btn-group-vertical',
          className
        )}
        ref={ref}
        {...props}
      >
        {childrenWithProps}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';