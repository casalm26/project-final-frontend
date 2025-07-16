import styled from 'styled-components';

const StyledHealthBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.health) {
      case 'healthy':
        return 'background: #d1fae5; color: #065f46;';
      case 'warning':
        return 'background: #fef3c7; color: #92400e;';
      case 'critical':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

export const HealthBadge = ({ health, children }) => (
  <StyledHealthBadge health={health}>
    {children || health}
  </StyledHealthBadge>
);