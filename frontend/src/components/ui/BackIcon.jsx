import React from 'react';

export const BackIcon = ({ className = '', ...props }) => {
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
        d="M19 12H5M12 19l-7-7 7-7"
      />
    </svg>
  );
};