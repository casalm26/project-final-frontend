import { useAuth } from '../../hooks/useAuth';
import { DarkModeToggle } from './DarkModeToggle';

export const DashboardHeader = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-none border-none cursor-pointer rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 m-0">
            Nanwa Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Welcome, <strong>{user?.firstName || user?.name}</strong>
            {isAdmin() && (
              <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-bold">
                Admin
              </span>
            )}
          </span>
          <DarkModeToggle size="sm" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};