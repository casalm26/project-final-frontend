import React from 'react';
import { SearchIcon, ServerIcon } from './';

export const NotFoundIllustration = ({ className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      <SearchIcon className="text-gray-400" />
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        className="absolute inset-0 text-red-500"
        style={{ width: '100%', height: '100%' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8l8 8" />
      </svg>
    </div>
  );
};

export const ServerErrorIllustration = ({ className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      <ServerIcon className="text-gray-400" />
    </div>
  );
};