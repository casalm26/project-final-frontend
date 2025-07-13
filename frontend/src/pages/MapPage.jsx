import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { ForestMap } from '../components/map/ForestMap';
import { GlobalFilters } from '../components/filters';
import { TreeDetailModal } from '../components/ui/TreeDetailModal';

const MapPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`;

const Sidebar = styled.aside`
  background: white;
  border-right: 1px solid #e5e7eb;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 10;
`;

const MainContent = styled.main`
  margin-left: 250px;
  padding: 2rem;
`;



export const MapPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [filters, setFilters] = useState({});
  const [selectedTree, setSelectedTree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // TODO: Update map data based on filters
    console.log('Map filters changed:', newFilters);
  }, []);

  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    setIsModalOpen(true);
  };

  const handleCloseTreeDetail = () => {
    setSelectedTree(null);
    setIsModalOpen(false);
  };

  return (
    <MapPageContainer>
      {/* Header */}
      <Header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">Nanwa Map View</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.name}</span>
                {isAdmin() && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Header>

      {/* Sidebar */}
      <Sidebar>
        <div className="p-6">
          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </a>
            <a
              href="#map"
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg"
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
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forest Map</h2>
            <p className="text-gray-600">
              Explore your forests and individual trees with interactive mapping.
            </p>
          </div>

          {/* Global Filters */}
          <GlobalFilters onFiltersChange={handleFiltersChange} />

          {/* Tree Detail Modal */}
          <TreeDetailModal
            tree={selectedTree}
            isOpen={isModalOpen}
            onClose={handleCloseTreeDetail}
          />

          {/* Map */}
          <ForestMap 
            onTreeSelect={handleTreeSelect}
            filters={filters}
          />
        </div>
      </MainContent>
    </MapPageContainer>
  );
}; 