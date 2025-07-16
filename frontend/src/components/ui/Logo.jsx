import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ className = '' }) => {
  return (
    <Link 
      to="/" 
      className={`text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight ${className}`}
    >
      Nanwa
    </Link>
  );
};