import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SurvivalRateChart, AverageHeightChart, CO2AbsorptionChart } from '../components/charts';
import { GlobalFilters } from '../components/filters';
import { ExportButtonComponent } from '../components/ui/ExportButton';
import { DarkModeToggle } from '../components/ui/DarkModeToggle';

// Mock data for export
const mockTreeData = [
  { id: 1, name: 'Tree A-001', species: 'Pine', height: 2.4, health: 'healthy', lat: 59.3293, lng: 18.0686 },
  { id: 2, name: 'Tree A-002', species: 'Oak', height: 2.1, health: 'healthy', lat: 59.3300, lng: 18.0690 },
  { id: 3, name: 'Tree A-003', species: 'Birch', height: 1.8, health: 'warning', lat: 59.3285, lng: 18.0675 },
  { id: 4, name: 'Tree A-004', species: 'Spruce', height: 1.5, health: 'critical', lat: 59.3310, lng: 18.0700 },
  { id: 5, name: 'Tree A-005', species: 'Pine', height: 2.7, health: 'healthy', lat: 59.3275, lng: 18.0660 },
  { id: 6, name: 'Tree A-006', species: 'Oak', height: 2.3, health: 'healthy', lat: 59.3320, lng: 18.0710 },
  { id: 7, name: 'Tree A-007', species: 'Birch', height: 1.9, health: 'warning', lat: 59.3265, lng: 18.0650 },
  { id: 8, name: 'Tree A-008', species: 'Spruce', height: 2.5, health: 'healthy', lat: 59.3330, lng: 18.0720 },
];

export const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // TODO: Update charts and data based on filters
    console.log('Filters changed:', newFilters);
  }, []);

  const handleExportStart = () => {
    console.log('Export started');
  };

  const handleExportComplete = (format, recordCount) => {
    console.log(`Export completed: ${format} with ${recordCount} records`);
  };

  const handleExportError = (error) => {
    console.error('Export error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle menu"
              className="flex items-center justify-center w-10 h-10 bg-none border-none cursor-pointer rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
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
              Welcome, <strong>{user?.name}</strong>
              {isAdmin() && (
                <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-bold">
                  Admin
                </span>
              )}
            </span>
            <DarkModeToggle size="sm" />
            <button
              onClick={handleLogout}
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-full lg:w-64 fixed lg:sticky top-0 h-screen overflow-y-auto z-50 lg:z-10 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <nav className="space-y-2">
            <a
              href="#dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </a>
            <a
              href="/map"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Map View
            </a>
            <a
              href="#export"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Data Export
            </a>
            {isAdmin() && (
              <a
                href="/admin"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Audit Log
              </a>
            )}
            
            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Nanwa Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300 text-sm">
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Nanwa</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your forests and track tree growth with real-time insights.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <DarkModeToggle size="md" />
                <ExportButtonComponent
                  data={mockTreeData}
                  fileName="dashboard_data"
                  filters={filters}
                  onExportStart={handleExportStart}
                  onExportComplete={handleExportComplete}
                  onExportError={handleExportError}
                />
              </div>
            </div>
          </div>

          {/* Global Filters */}
          <GlobalFilters onFiltersChange={handleFiltersChange} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Trees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">10,247</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Survival Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">95.2%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Height</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4m</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">CO₂ Absorbed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1.2t</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <SurvivalRateChart />
            </div>
            <div className="lg:col-span-1 xl:col-span-2">
              <AverageHeightChart />
            </div>
            <div className="lg:col-span-2 xl:col-span-3">
              <CO2AbsorptionChart />
            </div>
          </div>

          {/* Additional Dashboard Content */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forest Overview</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your forests are performing excellently with strong growth indicators and high survival rates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    New measurements recorded for Forest A
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Survival rate improved by 2.3%
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    CO₂ absorption increased by 15%
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Actions</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Schedule maintenance for Forest B
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Review growth data for Q4 report
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Address low-performing areas in Forest C
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 