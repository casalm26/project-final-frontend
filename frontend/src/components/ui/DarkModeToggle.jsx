import { useDarkMode } from '../../contexts/DarkModeContext';
import { IconButton } from './IconButton';
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';
import { cn } from '@/lib/utils';

export const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <IconButton
      onClick={toggleDarkMode}
      className={cn(
        'relative bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
        className
      )}
      size={size}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon for light mode */}
      <SunIcon
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        )}
      />

      {/* Moon icon for dark mode */}
      <MoonIcon
        className={cn(
          iconSizes[size],
          'absolute transition-all duration-200',
          isDarkMode ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        )}
      />
    </IconButton>
  );
}; 