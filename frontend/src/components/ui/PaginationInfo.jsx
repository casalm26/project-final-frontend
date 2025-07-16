import styled from 'styled-components';

const InfoContainer = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const PaginationInfo = ({ startIndex, pageSize, totalItems }) => {
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <InfoContainer>
      Showing {startIndex + 1} to {endIndex} of {totalItems} entries
    </InfoContainer>
  );
};