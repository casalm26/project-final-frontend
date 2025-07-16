import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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

const BackLink = styled.a`
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

const AdminBadge = styled.span`
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeText = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const LogoutButton = styled.button`
  color: #374151;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #10b981;
  }
`;

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const AdminHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Header>
      <HeaderContent>
        <BackLink href="/dashboard">
          <BackIcon />
          Back to Dashboard
        </BackLink>
        
        <UserInfo>
          <AdminBadge>Admin Panel</AdminBadge>
          <WelcomeText>
            Welcome, <strong>{user?.name}</strong>
          </WelcomeText>
          <LogoutButton onClick={handleLogout} aria-label="Logout">
            <LogoutIcon />
          </LogoutButton>
        </UserInfo>
      </HeaderContent>
    </Header>
  );
};