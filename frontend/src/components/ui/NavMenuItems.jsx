import React from 'react';
import { Link } from 'react-router-dom';

export const NavMenuItems = () => {
  const linkBase =
    'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors px-4 py-2 text-base font-medium focus-ring rounded-md';

  return (
    <>
      <a href="#features" className={linkBase}>
        Features
      </a>
      <a href="#about" className={linkBase}>
        About
      </a>
      <Link to="/login" className={linkBase}>
        Login
      </Link>
      <Link
        to="/register"
        className="ml-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-base font-medium focus-ring"
      >
        Get Started
      </Link>
    </>
  );
};