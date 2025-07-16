import styled from 'styled-components';
import { usePagination } from '../../hooks/usePagination';
import { PaginationInfo } from './PaginationInfo';
import { PageNumbers } from './PageNumbers';

const PaginationContainer = styled.div`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PaginationButton = styled.button`
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
`;

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  startIndex, 
  pageSize, 
  totalItems,
  onPageChange 
}) => {
  const { 
    pageNumbers, 
    canGoFirst, 
    canGoPrevious, 
    canGoNext, 
    canGoLast 
  } = usePagination({ currentPage, totalPages });

  // TODO: Consider moving pagination state to Zustand store for better state management across components
  
  return (
    <PaginationContainer>
      <PaginationInfo 
        startIndex={startIndex}
        pageSize={pageSize}
        totalItems={totalItems}
      />
      <PaginationControls>
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={!canGoFirst}
        >
          First
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          Previous
        </PaginationButton>
        <PageNumbers
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          Next
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoLast}
        >
          Last
        </PaginationButton>
      </PaginationControls>
    </PaginationContainer>
  );
};