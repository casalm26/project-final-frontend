import React from 'react';
import { StandardLoadingSpinner } from './StandardLoadingSpinner';
import { SkeletonChart } from './SkeletonLoader';
import { cn } from '@/lib/utils';

export const ChartLoader = ({ 
  variant = 'spinner', // 'spinner', 'skeleton'
  title,
  className = '' 
}) => {
  if (variant === 'skeleton') {
    return <SkeletonChart className={className} />;
  }

  return (
    <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <StandardLoadingSpinner 
        variant="minimal"
        text="Loading chart data..."
        size="lg"
        className="min-h-[200px]"
      />
    </div>
  );
};