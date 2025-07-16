import styled from 'styled-components';

const StatCardContainer = styled.div`
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

export const StatCard = ({ icon, value, label, type }) => {
  return (
    <StatCardContainer>
      <StatIcon type={type}>
        {icon}
      </StatIcon>
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </StatCardContainer>
  );
};