import styled from 'styled-components';

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #10b981;
    color: white;
    border-color: #10b981;
  }
`;

export const PageNumbers = ({ pageNumbers, currentPage, onPageChange }) => {
  return (
    <>
      {pageNumbers.map(pageNumber => (
        <PageButton
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={currentPage === pageNumber ? 'active' : ''}
        >
          {pageNumber}
        </PageButton>
      ))}
    </>
  );
};