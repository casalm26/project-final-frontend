import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const TreeHeader = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const TreeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const TreeSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const HealthBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  ${props => {
    switch (props.health) {
      case 'healthy':
        return 'background: #d1fae5; color: #065f46;';
      case 'warning':
        return 'background: #fef3c7; color: #92400e;';
      case 'critical':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const MeasurementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  color: #111827;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  text-align: center;
`;

// Mock data - in real app this would come from API
const mockTrees = [
  { id: 1, name: 'Tree A-001', species: 'Pine', height: 2.4, health: 'healthy', lat: 59.3293, lng: 18.0686 },
  { id: 2, name: 'Tree A-002', species: 'Oak', height: 2.1, health: 'healthy', lat: 59.3300, lng: 18.0690 },
  { id: 3, name: 'Tree A-003', species: 'Birch', height: 1.8, health: 'warning', lat: 59.3285, lng: 18.0675 },
  { id: 4, name: 'Tree A-004', species: 'Spruce', height: 1.5, health: 'critical', lat: 59.3310, lng: 18.0700 },
  { id: 5, name: 'Tree A-005', species: 'Pine', height: 2.7, health: 'healthy', lat: 59.3275, lng: 18.0660 },
  { id: 6, name: 'Tree A-006', species: 'Oak', height: 2.3, health: 'healthy', lat: 59.3320, lng: 18.0710 },
  { id: 7, name: 'Tree A-007', species: 'Birch', height: 1.9, health: 'warning', lat: 59.3265, lng: 18.0650 },
  { id: 8, name: 'Tree A-008', species: 'Spruce', height: 2.5, health: 'healthy', lat: 59.3330, lng: 18.0720 },
];

const mockMeasurementHistory = [
  { date: '2024-01-15', height: 2.4, diameter: 8.2, health: 'healthy' },
  { date: '2024-02-15', height: 2.3, diameter: 8.1, health: 'healthy' },
  { date: '2024-03-15', height: 2.2, diameter: 8.0, health: 'healthy' },
  { date: '2024-04-15', height: 2.1, diameter: 7.9, health: 'warning' },
  { date: '2024-05-15', height: 2.0, diameter: 7.8, health: 'warning' },
  { date: '2024-06-15', height: 1.9, diameter: 7.7, health: 'warning' },
  { date: '2024-07-15', height: 1.8, diameter: 7.6, health: 'critical' },
  { date: '2024-08-15', height: 1.7, diameter: 7.5, health: 'critical' },
  { date: '2024-09-15', height: 1.6, diameter: 7.4, health: 'critical' },
  { date: '2024-10-15', height: 1.5, diameter: 7.3, health: 'critical' },
];

export const TreeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tree, setTree] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const treeData = mockTrees.find(t => t.id === parseInt(id));
        if (!treeData) {
          setError('Tree not found');
          return;
        }
        
        setTree(treeData);
        setMeasurements(mockMeasurementHistory);
      } catch (err) {
        setError('Failed to load tree data');
      } finally {
        setLoading(false);
      }
    };

    fetchTreeData();
  }, [id]);

  const handlePreviousTree = () => {
    const currentIndex = mockTrees.findIndex(t => t.id === parseInt(id));
    if (currentIndex > 0) {
      navigate(`/tree/${mockTrees[currentIndex - 1].id}`);
    }
  };

  const handleNextTree = () => {
    const currentIndex = mockTrees.findIndex(t => t.id === parseInt(id));
    if (currentIndex < mockTrees.length - 1) {
      navigate(`/tree/${mockTrees[currentIndex + 1].id}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Tree Details - ${tree.name}`,
        text: `Check out this tree: ${tree.name} (${tree.species})`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tree URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderContent>
            <BackLink to="/map">← Back to Map</BackLink>
          </HeaderContent>
        </Header>
        <MainContent>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </MainContent>
      </PageContainer>
    );
  }

  if (error || !tree) {
    return (
      <PageContainer>
        <Header>
          <HeaderContent>
            <BackLink to="/map">← Back to Map</BackLink>
          </HeaderContent>
        </Header>
        <MainContent>
          <ErrorMessage>
            {error || 'Tree not found'}
          </ErrorMessage>
        </MainContent>
      </PageContainer>
    );
  }

  const currentIndex = mockTrees.findIndex(t => t.id === parseInt(id));
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < mockTrees.length - 1;

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackLink to="/map">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Map
          </BackLink>
          
          <Navigation>
            <NavButton onClick={handlePreviousTree} disabled={!hasPrevious}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </NavButton>
            
            <NavButton onClick={handleNextTree} disabled={!hasNext}>
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavButton>
            
            <NavButton onClick={handleShare}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </NavButton>
          </Navigation>
        </HeaderContent>
      </Header>

      <MainContent>
        <TreeHeader>
          <TreeTitle>{tree.name}</TreeTitle>
          <TreeSubtitle>{tree.species} • Forest {tree.id <= 4 ? 'A' : 'B'}</TreeSubtitle>
        </TreeHeader>

        <ContentGrid>
          <MainSection>
            {/* Basic Information */}
            <InfoCard>
              <CardTitle>Tree Information</CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Current Height</InfoLabel>
                  <InfoValue>{tree.height}m</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Health Status</InfoLabel>
                  <InfoValue>
                    <HealthBadge health={tree.health}>{tree.health}</HealthBadge>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Species</InfoLabel>
                  <InfoValue>{tree.species}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Planted Date</InfoLabel>
                  <InfoValue>Mar 15, 2023</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoCard>

            {/* Measurement History */}
            <InfoCard>
              <CardTitle>Measurement History</CardTitle>
              <MeasurementTable>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Height (m)</TableHeaderCell>
                    <TableHeaderCell>Diameter (cm)</TableHeaderCell>
                    <TableHeaderCell>Health</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {measurements.slice(0, 10).map((measurement, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(measurement.date).toLocaleDateString()}</TableCell>
                      <TableCell>{measurement.height}</TableCell>
                      <TableCell>{measurement.diameter}</TableCell>
                      <TableCell>
                        <HealthBadge health={measurement.health}>{measurement.health}</HealthBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </MeasurementTable>
            </InfoCard>
          </MainSection>

          <SideSection>
            {/* Location */}
            <InfoCard>
              <CardTitle>Location</CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Latitude</InfoLabel>
                  <InfoValue>{tree.lat.toFixed(6)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Longitude</InfoLabel>
                  <InfoValue>{tree.lng.toFixed(6)}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoCard>

            {/* Contract Status */}
            <InfoCard>
              <CardTitle>Contract Details</CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Status</InfoLabel>
                  <InfoValue>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Last Inspection</InfoLabel>
                  <InfoValue>Jan 15, 2024</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoCard>
          </SideSection>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
}; 