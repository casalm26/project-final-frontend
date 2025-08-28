import React from 'react';
import { StandardSpinner } from './StandardSpinner';
import { cn } from '@/lib/utils';

export const StandardLoadingSpinner = ({ 
  text = 'Loading...', 
  size = 'md', 
  color = 'primary',
  fullscreen = false,
  className = '',
  showText = true,
  variant = 'default' // 'default', 'minimal', 'card'
}) => {
  const containerClasses = {
    default: 'flex flex-col items-center justify-center min-h-[200px] p-8',
    minimal: 'flex items-center justify-center p-4',
    card: 'flex flex-col items-center justify-center min-h-[300px] p-8 bg-white dark:bg-gray-800 rounded-lg shadow'
  };

  const fullscreenClasses = fullscreen 
    ? 'fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 min-h-screen'
    : '';

  return (
    <div 
      className={cn(
        containerClasses[variant],
        fullscreenClasses,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <StandardSpinner 
        size={size} 
        color={color}
        className="mb-3"
      />
      {showText && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};