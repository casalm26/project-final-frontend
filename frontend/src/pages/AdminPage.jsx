import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuditLogTable } from '../components/admin/AuditLogTable';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const StatIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  
  ${props => {
    switch (props.type) {
      case 'users':
        return 'background: #dbeafe; color: #1e40af;';
      case 'actions':
        return 'background: #d1fae5; color: #065f46;';
      case 'errors':
        return 'background: #fee2e2; color: #991b1b;';
      case 'activity':
        return 'background: #fef3c7; color: #92400e;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

export const AdminPage = () => {
  const { user, logout, isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <AdminContainer>
      <Header>
        <HeaderContent>
          <BackLink href="/dashboard">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </BackLink>
          
          <div className="flex items-center space-x-4">
            <AdminBadge>Admin Panel</AdminBadge>
            <span className="text-sm text-gray-700">
              Welcome, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </HeaderContent>
      </Header>

      <MainContent>
        <PageHeader>
          <PageTitle>System Administration</PageTitle>
          <PageDescription>
            Monitor system activity and user actions with comprehensive audit logging.
          </PageDescription>
        </PageHeader>

        {/* Admin Stats */}
        <StatsGrid>
          <StatCard>
            <StatIcon type="users">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </StatIcon>
            <StatValue>42</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon type="actions">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </StatIcon>
            <StatValue>1,247</StatValue>
            <StatLabel>Total Actions Today</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon type="errors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </StatIcon>
            <StatValue>3</StatValue>
            <StatLabel>Failed Actions</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon type="activity">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </StatIcon>
            <StatValue>98.5%</StatValue>
            <StatLabel>System Uptime</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Audit Log Table */}
        <AuditLogTable />
      </MainContent>
    </AdminContainer>
  );
}; 