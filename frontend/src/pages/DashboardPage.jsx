import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { SurvivalRateChart, AverageHeightChart, CO2AbsorptionChart } from '../components/charts';
import { GlobalFilters } from '../components/filters';
import { ExportButtonComponent } from '../components/ui/ExportButton';
import { mediaQueries, spacing, touchTarget } from '../utils/responsive';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  
  ${mediaQueries.desktop} {
    flex-direction: row;
  }
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: ${spacing.md};
  position: sticky;
  top: 0;
  z-index: 100;
  
  ${mediaQueries.desktop} {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${touchTarget.comfortable};
  height: ${touchTarget.comfortable};
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: #374151;
  }
  
  ${mediaQueries.desktop} {
    display: none;
  }
`;

const Sidebar = styled.aside`
  background: white;
  border-right: 1px solid #e5e7eb;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  
  ${({ isOpen }) => isOpen && `
    transform: translateX(0);
  `}
  
  ${mediaQueries.desktop} {
    width: 250px;
    position: sticky;
    top: 0;
    transform: translateX(0);
    z-index: 10;
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  ${mediaQueries.desktop} {
    display: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${spacing.md};
  
  ${mediaQueries.tablet} {
    padding: ${spacing.lg};
  }
  
  ${mediaQueries.desktop} {
    padding: ${spacing.xl};
  }
`;

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
    <DashboardContainer>
      {/* Mobile Header */}
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MobileMenuButton onClick={toggleSidebar} aria-label="Toggle menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuButton>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
              Nanwa Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
            <span style={{ color: '#374151' }}>
              Welcome, <strong>{user?.name}</strong>
              {isAdmin() && (
                <span style={{ 
                  marginLeft: '0.5rem', 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626', 
                  fontSize: '0.75rem', 
                  borderRadius: '9999px',
                  fontWeight: 'bold'
                }}>
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#16a34a'}
              onMouseOut={(e) => e.target.style.color = '#374151'}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </Header>

      {/* Sidebar Overlay */}
      <SidebarOverlay isOpen={sidebarOpen} onClick={closeSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        <div className="p-6">
          <nav className="space-y-2">
            <a
              href="#dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </a>
            <a
              href="/map"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Map View
            </a>
            <a
              href="#export"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Data Export
            </a>
            {isAdmin() && (
              <a
                href="#audit"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Audit Log
              </a>
            )}
          </nav>
        </div>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Nanwa</h2>
                <p className="text-gray-600">
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trees</p>
                  <p className="text-2xl font-bold text-gray-900">10,247</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Survival Rate</p>
                  <p className="text-2xl font-bold text-gray-900">95.2%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Height</p>
                  <p className="text-2xl font-bold text-gray-900">2.4m</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CO₂ Absorbed</p>
                  <p className="text-2xl font-bold text-gray-900">1.2t</p>
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
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Forest Overview</h3>
            <p className="text-gray-600 mb-4">
              Your forests are performing excellently with strong growth indicators and high survival rates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <ul className="space-y-2 text-sm text-gray-600">
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
                <h4 className="font-medium text-gray-900 mb-2">Next Actions</h4>
                <ul className="space-y-2 text-sm text-gray-600">
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
      </MainContent>
    </DashboardContainer>
  );
}; 