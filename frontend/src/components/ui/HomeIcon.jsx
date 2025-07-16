import React from 'react';

export const HomeIcon = ({ className = '', ...props }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      />
      <polyline
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        points="9,22 9,12 15,12 15,22"
      />
    </svg>
  );
};