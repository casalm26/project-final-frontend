import React from 'react';
import { cn } from '@utils/cn';

export const Skeleton = ({ 
  className = '', 
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  ...props 
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        width,
        height,
        rounded,
        className
      )}
      {...props}
    />
  );
};

// Pre-built skeleton patterns
export const SkeletonCard = ({ className = '' }) => (
  <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
    <Skeleton height="h-6" width="w-3/4" className="mb-4" />
    <Skeleton height="h-4" width="w-full" className="mb-2" />
    <Skeleton height="h-4" width="w-2/3" className="mb-4" />
    <Skeleton height="h-32" width="w-full" />
  </div>
);

export const SkeletonChart = ({ className = '' }) => (
  <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
    <div className="flex justify-between items-center mb-6">
      <Skeleton height="h-6" width="w-48" />
      <Skeleton height="h-4" width="w-16" />
    </div>
    <div className="space-y-4">
      <div className="flex items-end space-x-2 h-64">
        {[...Array(8)].map((_, i) => (
          <Skeleton 
            key={i}
            height={`h-${Math.floor(Math.random() * 40) + 20}`}
            width="w-8"
            className="flex-1"
          />
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <Skeleton height="h-3" width="w-12" />
        <Skeleton height="h-3" width="w-16" />
        <Skeleton height="h-3" width="w-14" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
    <Skeleton height="h-8" width="w-48" className="mb-6" />
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton height="h-4" width="w-16" />
          <Skeleton height="h-4" width="w-32" />
          <Skeleton height="h-4" width="w-24" />
          <Skeleton height="h-4" width="w-20" />
          <Skeleton height="h-4" width="w-12" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard = ({ className = '' }) => (
  <div className={cn('space-y-6', className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton height="h-8" width="w-64" />
      <Skeleton height="h-10" width="w-32" />
    </div>
    
    {/* Metrics cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-8" width="w-16" className="mb-1" />
          <Skeleton height="h-3" width="w-20" />
        </div>
      ))}
    </div>
    
    {/* Charts grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>
  </div>
);