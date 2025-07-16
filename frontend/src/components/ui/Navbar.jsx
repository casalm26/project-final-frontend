import { useState, useRef, useEffect } from 'react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { DarkModeToggle } from './DarkModeToggle';
import { Logo } from './Logo';
import { NavMenuItems } from './NavMenuItems';
import { MobileMenuDropdown } from './MobileMenuDropdown';
import { IconButton } from './IconButton';
import { MenuIcon } from './MenuIcon';
import { CloseIcon } from './CloseIcon';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const { containerRef, focusFirst } = useKeyboardNavigation({
    onEscape: () => setOpen(false),
    trapFocus: open,
    autoFocus: false,
  });

  const toggleMenu = () => {
    setOpen(!open);
  };

  // Focus management when menu opens/closes
  useEffect(() => {
    if (open) {
      // Focus first menu item when menu opens
      setTimeout(() => {
        focusFirst();
      }, 100);
    } else {
      // Focus menu button when menu closes
      setTimeout(() => {
        menuButtonRef.current?.focus();
      }, 100);
    }
  }, [open, focusFirst]);

  // Handle keyboard navigation for menu button
  const handleMenuKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  };

  // TODO: Consider moving menu open state to Zustand store for better state management across components

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavMenuItems />
            <DarkModeToggle size="sm" />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle size="sm" />
            <IconButton
              ref={menuButtonRef}
              aria-label="Toggle menu"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              onClick={toggleMenu}
              onKeyDown={handleMenuKeyDown}
            >
              {open ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div ref={containerRef}>
        <MobileMenuDropdown isOpen={open} />
      </div>
    </nav>
  );
}; 