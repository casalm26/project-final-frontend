import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BiodiversityTrendsChart from '../components/charts/BiodiversityTrendsChart';
import { GlobalFilters } from '../components/filters';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { EnhancedStatCard } from '../components/ui/EnhancedStatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const EcologicalDashboardPage = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarState();
  const [filters, setFilters] = useState({});
  
  // Fetch dashboard statistics with current filters
  const { stats, loading: statsLoading, error: statsError, refresh } = useDashboardStats(filters);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Helper functions for formatting data
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const formatIndex = (num, max = 1) => {
    if (!num) return '0';
    return `${num.toFixed(1)}`;
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardHeader onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <nav className="flex mb-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                      <li>
                        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          Overview
                        </Link>
                      </li>
                      <li>
                        <svg className="flex-shrink-0 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                      </li>
                      <li>
                        <span className="text-gray-900 dark:text-white font-medium">Ecological Dashboard</span>
                      </li>
                    </ol>
                  </nav>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ecological Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Environmental impact, biodiversity tracking, and conservation metrics for sustainable forest management.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Filters */}
            <GlobalFilters onFiltersChange={handleFiltersChange} />

            {/* Stats Cards */}
            {statsLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Loading ecological data..." />
              </div>
            ) : statsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-600">Error loading ecological statistics: {statsError}</p>
                <button 
                  onClick={refresh}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forest Health Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <EnhancedStatCard
                    icon={
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    }
                    title="Number of Species"
                    value={formatNumber(stats?.manager?.biodiversity?.totalSpecies || stats?.ecological?.biodiversity?.speciesCount || 10)}
                    subtitle="Different tree species in the system"
                    color="purple"
                  />
                </div>
              </div>
            )}

            {/* Biodiversity Analysis */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biodiversity Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <BiodiversityTrendsChart filters={filters} chartType="line" />
                </div>
                <div className="col-span-1">
                  <BiodiversityTrendsChart filters={filters} chartType="area" />
                </div>
                <div className="col-span-1 lg:col-span-2">
                  <BiodiversityTrendsChart filters={filters} chartType="composed" />
                </div>
              </div>
            </div>



            {/* Quick Navigation */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/dashboard" className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
                        <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Overview Dashboard</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Return to the main overview for quick insights across all metrics.
                    </p>
                  </div>
                </Link>

                <Link to="/dashboard/financial" className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Financial Dashboard</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Explore the financial implications of your conservation efforts and environmental performance.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};