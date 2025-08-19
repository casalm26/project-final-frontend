import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ForestValueAppreciationChart from '../components/charts/ForestValueAppreciationChart';
import HealthStatusDistributionChart from '../components/charts/HealthStatusDistributionChart';
import EnvironmentalRiskMatrixChart from '../components/charts/EnvironmentalRiskMatrixChart';
import CarbonCreditRevenueChart from '../components/charts/CarbonCreditRevenueChart';
import MaintenanceCostAnalysisChart from '../components/charts/MaintenanceCostAnalysisChart';
import SpeciesEconomicPerformanceChart from '../components/charts/SpeciesEconomicPerformanceChart';
import GrowthPerformancePredictionsChart from '../components/charts/GrowthPerformancePredictionsChart';
import { GlobalFilters } from '../components/filters';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { EnhancedStatCard } from '../components/ui/EnhancedStatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const FinancialDashboardPage = () => {
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
                        <span className="text-gray-900 dark:text-white font-medium">Financial Dashboard</span>
                      </li>
                    </ol>
                  </nav>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Investment performance, revenue analysis, and financial risk assessment for your forest portfolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Filters */}
            <GlobalFilters onFiltersChange={handleFiltersChange} />

            {/* Stats Cards */}
            {statsLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner text="Loading financial data..." />
              </div>
            ) : statsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-600">Error loading financial statistics: {statsError}</p>
                <button 
                  onClick={refresh}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Investment Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      }
                      title="Portfolio Value"
                      value={formatLargeCurrency(stats?.investor?.portfolio?.totalCurrentValue)}
                      subtitle={`${stats?.investor?.portfolio?.forestCount || 0} forests | Avg: ${formatLargeCurrency(stats?.investor?.portfolio?.averageValue)}`}
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
                      subtitle={`Range: ${formatPercentage(stats?.investor?.roi?.minROI)} - ${formatPercentage(stats?.investor?.roi?.maxROI)}`}
                      color="blue"
                    />
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      }
                      title="Carbon Credits"
                      value={formatNumber(stats?.investor?.carbonCredits?.totalAvailable)}
                      subtitle={`${formatNumber(stats?.investor?.carbonCredits?.totalSold)} sold | ${formatCurrency(stats?.investor?.carbonCredits?.averagePrice)}/credit`}
                      color="green"
                    />
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                      title="Timber Value"
                      value={formatLargeCurrency(stats?.investor?.timber?.totalValue)}
                      subtitle={`${formatCurrency(stats?.investor?.timber?.averageValuePerTree)}/tree avg`}
                      color="orange"
                    />
                  </div>
                </div>

                {/* Maintenance Budget */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget & Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <EnhancedStatCard
                      icon={
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      }
                      title="Maintenance Budget"
                      value={formatLargeCurrency(stats?.investor?.maintenance?.totalBudget)}
                      subtitle={`${formatPercentage(stats?.investor?.maintenance?.utilization)}% utilized | ${formatLargeCurrency(stats?.investor?.maintenance?.totalSpent)} spent`}
                      color="purple"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Revenue Analysis */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <CarbonCreditRevenueChart filters={filters} chartType="line" />
                </div>
                <div className="col-span-1">
                  <CarbonCreditRevenueChart filters={filters} chartType="bar" />
                </div>
                <div className="col-span-1">
                  <SpeciesEconomicPerformanceChart filters={filters} chartType="bar" />
                </div>
              </div>
            </div>

            {/* Growth & Returns */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth & Returns</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <ForestValueAppreciationChart filters={filters} />
                </div>
                <div className="col-span-1 lg:col-span-1">
                  <GrowthPerformancePredictionsChart filters={filters} chartType="line" />
                </div>
                <div className="col-span-1 lg:col-span-2">
                  <GrowthPerformancePredictionsChart filters={filters} chartType="area" />
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Risk Assessment</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <HealthStatusDistributionChart filters={filters} chartType="bar" />
                </div>
                <div className="col-span-1">
                  <EnvironmentalRiskMatrixChart filters={filters} chartType="bar" />
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

                <Link to="/dashboard/ecological" className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                        <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Ecological Dashboard</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Explore environmental impact and biodiversity metrics that affect long-term value.
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