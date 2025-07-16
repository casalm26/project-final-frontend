import styled from 'styled-components';
import { InfoCard } from './InfoCard';
import { HealthBadge } from './HealthBadge';

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

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

export const TreeDetailInfo = ({ tree }) => (
  <Card>
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
  </Card>
);