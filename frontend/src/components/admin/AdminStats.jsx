import styled from 'styled-components';
import { StatCard } from './StatCard';
import { useAdminStats } from '../../hooks/useAdminStats';
import LoadingSpinner from '@components/ui/LoadingSpinner';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ActionsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const ErrorsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const AdminStats = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return <LoadingSpinner text="Loading statistics..." />;
  }

  if (error) {
    console.error('Admin stats error:', error);
  }

  const statsData = [
    {
      icon: <UsersIcon />,
      value: stats.activeUsers.toString(),
      label: 'Active Users Today',
      type: 'users'
    },
    {
      icon: <ActionsIcon />,
      value: stats.totalActions.toLocaleString(),
      label: 'Total Actions Today',
      type: 'actions'
    },
    {
      icon: <ErrorsIcon />,
      value: stats.failedActions.toString(),
      label: 'Failed Actions',
      type: 'errors'
    },
    {
      icon: <ActivityIcon />,
      value: `${stats.systemUptime}%`,
      label: 'System Uptime',
      type: 'activity'
    }
  ];

  return (
    <StatsGrid>
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          type={stat.type}
        />
      ))}
    </StatsGrid>
  );
};