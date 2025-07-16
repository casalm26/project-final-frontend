import { useState, useCallback } from 'react';
import { SurvivalRateChart, AverageHeightChart, CO2AbsorptionChart } from '../components/charts';
import { GlobalFilters } from '../components/filters';
import { ExportButtonComponent } from '../components/ui/ExportButton';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { DashboardStatCard } from '../components/ui/DashboardStatCard';
import { ForestOverviewSection } from '../components/ui/ForestOverviewSection';
import { useSidebarState } from '../hooks/useSidebarState';

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
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarState();
  // TODO: Consider moving filters state to Zustand store for better global state management
  const [filters, setFilters] = useState({});

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
            <DashboardStatCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="Total Trees"
              value="10,247"
              color="green"
            />
            <DashboardStatCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Survival Rate"
              value="95.2%"
              color="blue"
            />
            <DashboardStatCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              title="Avg Height"
              value="2.4m"
              color="yellow"
            />
            <DashboardStatCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="CO₂ Absorbed"
              value="1.2t"
              color="purple"
            />
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

          <ForestOverviewSection />
        </div>
        </main>
      </div>
    </div>
  );
}; 