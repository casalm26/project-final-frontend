import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SurvivalRateChart, CO2AbsorptionChart } from '../components/charts';
import ForestValueAppreciationChart from '../components/charts/ForestValueAppreciationChart';
import { GlobalFilters } from '../components/filters';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { DashboardStatCard } from '../components/ui/DashboardStatCard';
import { EnhancedStatCard } from '../components/ui/EnhancedStatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const OverviewDashboardPage = () => {
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

  const formatPercentage = (num) => {
    if (!num) return '0%';
    return `${num.toFixed(1)}%`;
  };

  const formatHeight = (num) => {
    if (!num) return '0m';
    return `${num.toFixed(1)}m`;
  };

  const formatCO2 = (num) => {
    if (!num) return '0t';
    return `${num.toFixed(1)}t`;
  };

  const formatCurrency = (num, currency = 'SEK') => {
    if (!num) return '0';
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(num);
  };

  const formatLargeCurrency = (num, currency = 'SEK') => {
    if (!num) return '0';
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M ${currency}`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K ${currency}`;
    }
    return formatCurrency(num, currency);
  };

  const formatIndex = (num, max = 100) => {
    if (!num) return '0';
    return `${num.toFixed(1)}/${max}`;
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardHeader onToggleSidebar={toggleSidebar} />

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 lg:flex-row">
        <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forest Overview</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monitor your forests with real-time insights. Navigate to specialized dashboards for detailed analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Filters */}
            <GlobalFilters onFiltersChange={handleFiltersChange} />

            {/* Stats Cards */}
            {statsLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Loading dashboard overview..." />
              </div>
            ) : statsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-600">Error loading dashboard statistics: {statsError}</p>
                <button 
                  onClick={refresh}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Core KPIs */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Core Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      }
                      title="Total Trees"
                      value={formatNumber(stats?.overview?.totalTrees)}
                      color="green"
                    />
                    <DashboardStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      }
                      title="Survival Rate"
                      value={formatPercentage(stats?.overview?.survivalRate)}
                      color="blue"
                    />
                    <DashboardStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      }
                      title="Avg Height"
                      value={formatHeight(stats?.height?.average)}
                      color="yellow"
                    />
                    <DashboardStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      }
                      title="CO₂ Absorbed"
                      value={formatCO2(stats?.co2?.totalAbsorption)}
                      color="purple"
                    />
                  </div>
                </div>

                {/* Quick Financial Summary */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Summary</h3>
                    <Link 
                      to="/dashboard/financial"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      View Full Financial Dashboard →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      }
                      title="Portfolio Value"
                      value={formatLargeCurrency(stats?.investor?.portfolio?.totalCurrentValue)}
                      subtitle={`${stats?.investor?.portfolio?.forestCount || 0} forests`}
                      color="green"
                    />
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      }
                      title="Average ROI"
                      value={formatPercentage(stats?.investor?.roi?.averageROI)}
                      subtitle={`${formatLargeCurrency(stats?.investor?.roi?.totalValueGain)} total gain`}
                      color="blue"
                    />
                  </div>
                </div>

                {/* Quick Ecological Summary */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ecological Summary</h3>
                    <Link 
                      to="/dashboard/ecological"
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm"
                    >
                      View Full Ecological Dashboard →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      }
                      title="Biodiversity Index"
                      value={formatIndex(stats?.manager?.biodiversity?.averageIndex)}
                      subtitle={`${formatNumber(stats?.manager?.biodiversity?.totalSpecies)} species tracked`}
                      color="green"
                    />
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.71 0L4.104 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      }
                      title="Trees at Risk"
                      value={formatNumber(stats?.manager?.treesAtRisk?.total)}
                      subtitle={`${formatNumber(stats?.manager?.treesAtRisk?.critical)} critical`}
                      color="red"
                    />
                  </div>
                </div>

                {/* Navigation Cards */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/dashboard/financial" className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Dashboard</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Detailed investment analytics including ROI, carbon credit revenue, maintenance costs, and species economic performance.
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          View Financial Analytics
                          <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>

                    <Link to="/dashboard/ecological" className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Ecological Dashboard</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Comprehensive environmental impact analysis including biodiversity trends, ecological benefits, and conservation metrics.
                        </p>
                        <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                          View Ecological Analytics
                          <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Key Charts */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <SurvivalRateChart filters={filters} />
                </div>
                <div className="col-span-1">
                  <ForestValueAppreciationChart filters={filters} />
                </div>
                <div className="col-span-1 xl:col-span-1">
                  <CO2AbsorptionChart filters={filters} />
                </div>
              </div>
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center py-8">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Recent activities and alerts will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};