import styled from 'styled-components';

const StyledActionBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.action) {
      case 'CREATE':
        return 'background: #d1fae5; color: #065f46;';
      case 'UPDATE':
        return 'background: #dbeafe; color: #1e40af;';
      case 'DELETE':
        return 'background: #fee2e2; color: #991b1b;';
      case 'LOGIN':
        return 'background: #fef3c7; color: #92400e;';
      case 'LOGOUT':
        return 'background: #f3f4f6; color: #374151;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

export const ActionBadge = ({ action, children }) => (
  <StyledActionBadge action={action}>
    {children || action}
  </StyledActionBadge>
);