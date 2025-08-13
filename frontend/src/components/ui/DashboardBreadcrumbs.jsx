import { Link, useLocation } from 'react-router-dom';

export const DashboardBreadcrumbs = () => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return [
        { name: 'Dashboard Overview', path: '/dashboard', current: true }
      ];
    }
    
    if (path === '/dashboard/financial') {
      return [
        { name: 'Overview', path: '/dashboard', current: false },
        { name: 'Financial Dashboard', path: '/dashboard/financial', current: true }
      ];
    }
    
    if (path === '/dashboard/ecological') {
      return [
        { name: 'Overview', path: '/dashboard', current: false },
        { name: 'Ecological Dashboard', path: '/dashboard/ecological', current: true }
      ];
    }
    
    // Default fallback
    return [
      { name: 'Dashboard', path: '/dashboard', current: true }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path}>
            <div className="flex items-center">
              {index > 0 && (
                <svg 
                  className="flex-shrink-0 h-4 w-4 text-gray-400 mr-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              {breadcrumb.current ? (
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link 
                  to={breadcrumb.path}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors duration-200"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default DashboardBreadcrumbs;