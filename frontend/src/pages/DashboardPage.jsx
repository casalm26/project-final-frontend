import { useState, useCallback } from 'react';
import { AverageHeightChart } from '../components/charts';
import HistoricalCO2AbsorptionChart from '../components/charts/HistoricalCO2AbsorptionChart';
import EnhancedSurvivalRateChart from '../components/charts/EnhancedSurvivalRateChart';
import ForestHealthIndexChart from '../components/charts/ForestHealthIndexChart';
import HealthStatusDistributionChart from '../components/charts/HealthStatusDistributionChart';
import EnvironmentalRiskMatrixChart from '../components/charts/EnvironmentalRiskMatrixChart';
import CarbonCreditRevenueChart from '../components/charts/CarbonCreditRevenueChart';
import MaintenanceCostAnalysisChart from '../components/charts/MaintenanceCostAnalysisChart';
import SpeciesEconomicPerformanceChart from '../components/charts/SpeciesEconomicPerformanceChart';
import GrowthPerformancePredictionsChart from '../components/charts/GrowthPerformancePredictionsChart';
import EcologicalBenefitsChart from '../components/charts/EcologicalBenefitsChart';
import BiodiversityTrendsChart from '../components/charts/BiodiversityTrendsChart';
import { GlobalFilters } from '../components/filters';
import { ExportButtonComponent } from '../components/ui/ExportButton';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { DashboardStatCard } from '../components/ui/DashboardStatCard';
import { EnhancedStatCard } from '../components/ui/EnhancedStatCard';
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
            <>
              {/* Core Metrics */}
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

              {/* Investor Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Investor Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <EnhancedStatCard
                    icon={
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    }
                    title="Carbon Credits"
                    value={formatNumber(stats?.investor?.carbonCredits?.totalAvailable)}
                    subtitle={`${formatCurrency(stats?.investor?.carbonCredits?.averagePrice)}/credit`}
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
                    subtitle={`${formatCurrency(stats?.investor?.timber?.averageValuePerTree)}/tree`}
                    color="orange"
                  />
                </div>
              </div>

              {/* Manager Metrics */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forest Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <EnhancedStatCard
                    icon={
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    }
                    title="Fire Risk Areas"
                    value={formatNumber(stats?.manager?.fireRisk?.highRiskForests)}
                    subtitle={`${formatNumber(stats?.manager?.fireRisk?.highRiskArea)} ha at risk`}
                    color="red"
                  />
                  <EnhancedStatCard
                    icon={
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    }
                    title="Species Diversity"
                    value={formatNumber(stats?.manager?.speciesDiversity?.uniqueSpecies)}
                    subtitle={`${formatNumber(stats?.manager?.speciesDiversity?.endangeredSpecies)} endangered`}
                    color="purple"
                  />
                </div>
              </div>
            </>
          )}

          {/* Original Charts Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Core Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="col-span-1">
                <EnhancedSurvivalRateChart filters={filters} />
              </div>
              <div className="col-span-1 xl:col-span-2">
                <AverageHeightChart filters={filters} />
              </div>
              <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                <HistoricalCO2AbsorptionChart filters={filters} />
              </div>
            </div>
          </div>

          {/* New Enhanced Charts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial & Investment Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1">
                <ForestHealthIndexChart forestId={filters?.forestId} dateRange={filters?.dateRange} />
              </div>
              <div className="col-span-1">
                <HealthStatusDistributionChart filters={filters} chartType="pie" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forest Management & Risk Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1">
                <HealthStatusDistributionChart filters={filters} chartType="bar" />
              </div>
              <div className="col-span-1">
                <EnvironmentalRiskMatrixChart filters={filters} chartType="bar" />
              </div>
            </div>
          </div>

          {/* Revenue & Financial Performance */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue & Financial Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1">
                <CarbonCreditRevenueChart filters={filters} chartType="line" />
              </div>
              <div className="col-span-1">
                <MaintenanceCostAnalysisChart filters={filters} chartType="composed" />
              </div>
              <div className="col-span-1">
                <SpeciesEconomicPerformanceChart filters={filters} chartType="bar" />
              </div>
              <div className="col-span-1">
                <MaintenanceCostAnalysisChart filters={filters} chartType="pie" />
              </div>
            </div>
          </div>

          {/* Growth & Performance Analysis */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth & Performance Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <GrowthPerformancePredictionsChart filters={filters} chartType="line" />
              </div>
              <div className="col-span-1">
                <SpeciesEconomicPerformanceChart filters={filters} chartType="scatter" />
              </div>
              <div className="col-span-1">
                <GrowthPerformancePredictionsChart filters={filters} chartType="area" />
              </div> 
            </div>
          </div>

          {/* Ecological Impact & Biodiversity */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ecological Impact & Biodiversity</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1">
                <EcologicalBenefitsChart filters={filters} chartType="radar" />
              </div>
              <div className="col-span-1">
                <BiodiversityTrendsChart filters={filters} chartType="line" />
              </div>
              <div className="col-span-1">
                <EcologicalBenefitsChart filters={filters} chartType="bar" />
              </div>
              <div className="col-span-1">
                <BiodiversityTrendsChart filters={filters} chartType="area" />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <EcologicalBenefitsChart filters={filters} chartType="area" />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <BiodiversityTrendsChart filters={filters} chartType="composed" />
              </div>
            </div>
          </div>

          <ForestOverviewSection />
        </div>
        </main>
      </div>
    </div>
  );
}; 