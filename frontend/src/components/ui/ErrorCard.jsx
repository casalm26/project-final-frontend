import React from 'react';
import { cn } from '@/lib/utils';

export const ErrorCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg text-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ErrorTitle = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        'text-red-600 text-3xl mb-4 font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const ErrorMessage = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        'text-gray-600 text-lg leading-relaxed mb-8',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export const ErrorDetails = ({ className, error, errorInfo, ...props }) => {
  return (
    <details
      className={cn(
        'mb-8 text-left',
        className
      )}
      {...props}
    >
      <summary className="cursor-pointer text-blue-600 font-medium mb-2 hover:text-blue-800">
        Show technical details
      </summary>
      <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm text-gray-700 whitespace-pre-wrap break-words">
        {error?.toString()}
        {errorInfo?.componentStack}
      </pre>
    </details>
  );
};