import React from 'react';

export const RefreshIcon = ({ className = '', ...props }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <polyline
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        points="23,4 23,10 17,10"
      />
      <polyline
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        points="1,20 1,14 7,14"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.51,15A9,9,0,0,0,18.36,18.36L23,14"
      />
    </svg>
  );
};