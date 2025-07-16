import React from 'react';

export const SearchIcon = ({ className = '', ...props }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="11"
        cy="11"
        r="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35"
      />
    </svg>
  );
};