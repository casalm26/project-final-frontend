import styled from 'styled-components';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
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
  color: #111827;
  margin: 0 0 1rem 0;
`;

const PageDescription = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`;

export const AdminPageLayout = ({ children }) => {
  return (
    <AdminContainer>
      {children}
    </AdminContainer>
  );
};

export const AdminPageHeader = ({ title, description }) => {
  return (
    <PageHeader>
      <PageTitle>{title}</PageTitle>
      <PageDescription>{description}</PageDescription>
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