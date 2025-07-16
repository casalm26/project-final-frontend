import React from 'react';
import { NavMenuItems } from './NavMenuItems';

export const MobileMenuDropdown = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4 space-y-1">
      <NavMenuItems />
    </div>
  );
};