import styled from 'styled-components';
import { ForestMap } from '../components/map/ForestMap';
import { GlobalFilters } from '../components/filters';
import { TreeDetailModal } from '../components/ui/TreeDetailModal';
import { MapPageHeader } from '../components/ui/MapPageHeader';
import { MapSidebar } from '../components/ui/MapSidebar';
import { MapPageHeaderSection } from '../components/ui/MapPageHeaderSection';
import { useMapFilters } from '../hooks/useMapFilters';
import { useTreeSelection } from '../hooks/useTreeSelection';

const MapPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const MainContent = styled.main`
  margin-left: 250px;
  padding: 2rem;
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



export const MapPage = () => {
  const { filters, handleFiltersChange } = useMapFilters();
  const { selectedTree, isModalOpen, handleTreeSelect, handleCloseTreeDetail } = useTreeSelection();

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
    <MapPageContainer>
      <MapPageHeader />
      <MapSidebar />

      {/* Main Content */}
      <MainContent>
        <div className="max-w-7xl mx-auto">
          <MapPageHeaderSection
            filters={filters}
            onExportStart={handleExportStart}
            onExportComplete={handleExportComplete}
            onExportError={handleExportError}
            mockTreeData={mockTreeData}
          />

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