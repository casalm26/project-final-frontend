import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoCard = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`;

const HealthBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const MeasurementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f3f4f6;
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

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageCard = styled.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100px;
  background: #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ShareButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ViewPageButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// Mock data for demonstration
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

export const TreeDetailModal = ({ tree, isOpen, onClose }) => {
  const [measurementHistory, setMeasurementHistory] = useState([]);

  const { containerRef, focusFirst } = useKeyboardNavigation({
    onEscape: onClose,
    trapFocus: true,
    autoFocus: true,
  });

  useEffect(() => {
    if (tree && isOpen) {
      // In a real application, this would fetch from an API
      setMeasurementHistory(mockMeasurementHistory);
    }
  }, [tree, isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Tree URL copied to clipboard!');
    }
  };

  if (!isOpen || !tree) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <ModalHeader>
          <ModalTitle id="modal-title">{tree.name}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {/* Basic Information */}
          <InfoGrid>
            <InfoCard>
              <InfoTitle>Basic Information</InfoTitle>
              <InfoItem>
                <InfoLabel>Tree ID:</InfoLabel>
                <InfoValue>{tree.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Species:</InfoLabel>
                <InfoValue>{tree.species}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Current Height:</InfoLabel>
                <InfoValue>{tree.height}m</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Health Status:</InfoLabel>
                <HealthBadge health={tree.health}>{tree.health}</HealthBadge>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Planted Date:</InfoLabel>
                <InfoValue>March 15, 2023</InfoValue>
              </InfoItem>
            </InfoCard>
            
            <InfoCard>
              <InfoTitle>Location & Contract</InfoTitle>
              <InfoItem>
                <InfoLabel>Latitude:</InfoLabel>
                <InfoValue>{tree.lat.toFixed(6)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Longitude:</InfoLabel>
                <InfoValue>{tree.lng.toFixed(6)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Forest:</InfoLabel>
                <InfoValue>Forest {tree.id <= 4 ? 'A' : 'B'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Contract Status:</InfoLabel>
                <InfoValue>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Active
                  </span>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Inspection:</InfoLabel>
                <InfoValue>Jan 15, 2024</InfoValue>
              </InfoItem>
            </InfoCard>
          </InfoGrid>

          {/* Measurement History */}
          <Section>
            <SectionTitle>Measurement History (Last 10 Entries)</SectionTitle>
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
                {measurementHistory.slice(0, 10).map((measurement, index) => (
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
          </Section>

          {/* Tree Images */}
          <Section>
            <SectionTitle>Tree Images</SectionTitle>
            <ImageGallery>
              <ImageCard>
                <ImagePlaceholder>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </ImagePlaceholder>
                <div className="text-xs text-gray-600">Latest Photo</div>
              </ImageCard>
              <ImageCard>
                <ImagePlaceholder>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </ImagePlaceholder>
                <div className="text-xs text-gray-600">Growth Progress</div>
              </ImageCard>
              <ImageCard>
                <ImagePlaceholder>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </ImagePlaceholder>
                <div className="text-xs text-gray-600">Planting Day</div>
              </ImageCard>
            </ImageGallery>
          </Section>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <ViewPageButton to={`/tree/${tree.id}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Full Page
            </ViewPageButton>
            <ShareButton onClick={handleShare}>
              <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Tree
            </ShareButton>
          </div>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}; 