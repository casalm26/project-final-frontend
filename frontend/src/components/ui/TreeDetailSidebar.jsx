import styled from 'styled-components';

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

export const TreeDetailSidebar = ({ tree }) => (
  <SideSection>
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
);