import React from 'react';
import { cn } from '@/lib/utils';

export const ErrorPageContainer = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ErrorPageCard = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-12 max-w-lg w-full text-center shadow-2xl',
        'md:p-8 md:mx-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ErrorPageIllustration = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'mb-8 [&>svg]:w-30 [&>svg]:h-30 [&>svg]:opacity-70',
        'md:[&>svg]:w-20 md:[&>svg]:h-20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ErrorPageCode = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        'text-6xl font-extrabold text-red-500 m-0 leading-none',
        'md:text-4xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const ErrorPageTitle = ({ className, children, ...props }) => {
  return (
    <h2
      className={cn(
        'text-2xl font-semibold text-gray-800 my-4',
        'md:text-xl',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export const ErrorPageMessage = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        'text-lg text-gray-600 leading-relaxed my-6 mb-8',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};