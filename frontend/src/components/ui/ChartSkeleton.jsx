import React from 'react';

export const ChartSkeleton = ({ type = 'bar', height = '300px' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      {/* Chart Header Skeleton */}
      <div className="mb-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
      
      {/* Chart Content Skeleton */}
      <div className="flex items-end justify-center space-x-2" style={{ height }}>
        {type === 'bar' && (
          <>
            <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 h-20"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 h-32"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 h-24"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 h-40"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 h-28"></div>
          </>
        )}
        
        {type === 'pie' && (
          <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full"></div>
          </div>
        )}
        
        {type === 'line' && (
          <div className="w-full h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path 
                d="M50,150 Q100,120 150,130 T250,110 T350,120" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                className="text-gray-300 dark:text-gray-600 animate-pulse"
              />
              <circle cx="50" cy="150" r="4" className="fill-gray-300 dark:fill-gray-600 animate-pulse" />
              <circle cx="150" cy="130" r="4" className="fill-gray-300 dark:fill-gray-600 animate-pulse" />
              <circle cx="250" cy="110" r="4" className="fill-gray-300 dark:fill-gray-600 animate-pulse" />
              <circle cx="350" cy="120" r="4" className="fill-gray-300 dark:fill-gray-600 animate-pulse" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Legend Skeleton */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
        {type !== 'pie' && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};