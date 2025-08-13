import { useAuth } from '../../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';

export const DashboardSidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Sidebar Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-full lg:w-64 fixed lg:sticky top-0 h-screen overflow-y-auto z-50 lg:z-10 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} aria-label="Sidebar">
        <div className="p-6">
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {/* Dashboards Section */}
            <div className="pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                Dashboards
              </p>
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                  }`}
                  aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Overview
                </Link>
                <Link
                  to="/dashboard/financial"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/dashboard/financial' 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }`}
                  aria-current={location.pathname === '/dashboard/financial' ? 'page' : undefined}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Financial
                </Link>
                <Link
                  to="/dashboard/ecological"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/dashboard/ecological' 
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                  }`}
                  aria-current={location.pathname === '/dashboard/ecological' ? 'page' : undefined}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Ecological
                </Link>
              </div>
            </div>
            
            {/* Other Navigation Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                Tools
              </p>
              <div className="space-y-1">
                <Link
                  to="/map"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/map' 
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-current={location.pathname === '/map' ? 'page' : undefined}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Map View
                </Link>
                <Link
                  to="/export"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/export' 
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-current={location.pathname === '/export' ? 'page' : undefined}
                >
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Data Export
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === '/admin' 
                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-current={location.pathname === '/admin' ? 'page' : undefined}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};