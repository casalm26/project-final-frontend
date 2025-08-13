import styled from 'styled-components';
import { useDarkMode } from '../../contexts/DarkModeContext';

const CardContainer = styled.div`
  background: ${props => props.$isDarkMode ? '#374151' : '#f9fafb'};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.$isDarkMode ? '#4b5563' : '#e5e7eb'};
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  margin: 0 0 1rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#4b5563' : '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  font-size: 0.875rem;
`;

export const InfoCard = ({ title, children }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <CardContainer $isDarkMode={isDarkMode}>
      <CardTitle $isDarkMode={isDarkMode}>{title}</CardTitle>
      {children}
    </CardContainer>
  );
};

export const InfoCardItem = ({ label, children }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <InfoItem $isDarkMode={isDarkMode}>
      <InfoLabel $isDarkMode={isDarkMode}>{label}:</InfoLabel>
      <InfoValue $isDarkMode={isDarkMode}>{children}</InfoValue>
    </InfoItem>
  );
};