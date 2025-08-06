import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Safely check localStorage (handles SSR)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      
      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default for SSR
    return false;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setDarkMode = (dark) => {
    setIsDarkMode(dark);
  };

  // Initialize dark mode on client-side
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        const savedMode = JSON.parse(saved);
        setIsDarkMode(savedMode);
      } else {
        // Use system preference if no saved preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPreference);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update localStorage and document class when dark mode changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.colorScheme = 'light';
      }
    }
  }, [isDarkMode, isInitialized]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    isInitialized,
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}; 