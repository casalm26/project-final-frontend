import styled from 'styled-components';

const CardContainer = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
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

export const InfoCard = ({ title, children }) => (
  <CardContainer>
    <CardTitle>{title}</CardTitle>
    {children}
  </CardContainer>
);

export const InfoCardItem = ({ label, children }) => (
  <InfoItem>
    <InfoLabel>{label}:</InfoLabel>
    <InfoValue>{children}</InfoValue>
  </InfoItem>
);