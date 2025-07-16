import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const TreeHeader = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

export const TreeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`;

export const TreeSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;