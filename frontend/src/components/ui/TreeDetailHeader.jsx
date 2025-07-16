import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BackIcon } from './BackIcon';

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

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export const TreeDetailHeader = ({ 
  onPrevious, 
  onNext, 
  onShare, 
  hasPrevious, 
  hasNext 
}) => (
  <Header>
    <HeaderContent>
      <BackLink to="/map">
        <BackIcon />
        Back to Map
      </BackLink>
      
      <Navigation>
        <NavButton onClick={onPrevious} disabled={!hasPrevious}>
          <ArrowLeftIcon />
          Previous
        </NavButton>
        
        <NavButton onClick={onNext} disabled={!hasNext}>
          Next
          <ArrowRightIcon />
        </NavButton>
        
        <NavButton onClick={onShare}>
          <ShareIcon />
          Share
        </NavButton>
      </Navigation>
    </HeaderContent>
  </Header>
);