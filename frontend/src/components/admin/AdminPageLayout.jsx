import styled from 'styled-components';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.$isDarkMode ? '#111827' : '#f9fafb'};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  margin: 0 0 1rem 0;
`;

const PageDescription = styled.p`
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 1.125rem;
  margin: 0;
`;

export const AdminPageLayout = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <AdminContainer $isDarkMode={isDarkMode}>
      {children}
    </AdminContainer>
  );
};

export const AdminPageHeader = ({ title, description }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <PageHeader>
      <PageTitle $isDarkMode={isDarkMode}>{title}</PageTitle>
      <PageDescription $isDarkMode={isDarkMode}>{description}</PageDescription>
    </PageHeader>
  );
};

export const AdminPageContent = ({ children }) => {
  return (
    <MainContent>
      {children}
    </MainContent>
  );
};