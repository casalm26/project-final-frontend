import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  
  @media (prefers-color-scheme: dark) {
    background: #1f2937;
    border-bottom-color: #374151;
  }
  
  .dark & {
    background: #1f2937;
    border-bottom-color: #374151;
  }
`;

export const MapPageHeader = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">Nanwa Map View</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Welcome, <span className="font-medium">{user?.name}</span>
              {isAdmin() && (
                <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Header>
  );
};