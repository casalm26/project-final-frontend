import React from 'react';

export const ServerIcon = ({ className = '', ...props }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="2"
        ry="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <line
        x1="8"
        y1="21"
        x2="16"
        y2="21"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <line
        x1="12"
        y1="17"
        x2="12"
        y2="21"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6"
      />
      <circle
        cx="12"
        cy="16"
        r="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};