import { useState, useCallback } from 'react';
import { SurvivalRateChart, AverageHeightChart, CO2AbsorptionChart } from '../components/charts';
import { GlobalFilters } from '../components/filters';
import { ExportButtonComponent } from '../components/ui/ExportButton';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { DashboardStatCard } from '../components/ui/DashboardStatCard';
import { ForestOverviewSection } from '../components/ui/ForestOverviewSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTreeData } from '../hooks/useTreeData';


export const DashboardPage = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarState();
  const [filters, setFilters] = useState({});
  
  // Fetch dashboard statistics with current filters
  const { stats, loading: statsLoading, error: statsError, refresh } = useDashboardStats(filters);
  
  // Fetch tree data for export functionality
  const { trees: treeData, loading: treesLoading } = useTreeData(filters);

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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Nanwa</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your forests and track tree growth with real-time insights.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportButtonComponent
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
          {statsLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner text="Loading dashboard statistics..." />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <SurvivalRateChart filters={filters} />
            </div>
            <div className="lg:col-span-1 xl:col-span-2">
              <AverageHeightChart filters={filters} />
            </div>
            <div className="lg:col-span-2 xl:col-span-3">
              <CO2AbsorptionChart filters={filters} />
            </div>
          </div>

          <ForestOverviewSection />
        </div>
        </main>
      </div>
    </div>
  );
}; 