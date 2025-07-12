import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const linkBase =
    'text-gray-700 hover:text-green-600 transition-colors px-4 py-2 text-base font-medium';

  const menuItems = (
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
        className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-base font-medium"
      >
        Get Started
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold text-green-600 tracking-tight">
            Nanwa
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">{menuItems}</div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-gray-700 hover:text-green-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4 space-y-1">{menuItems}</div>}
    </nav>
  );
}; 