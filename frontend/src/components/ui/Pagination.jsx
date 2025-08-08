import styled from 'styled-components';
import { usePagination } from '../../hooks/usePagination';
import { PaginationInfo } from './PaginationInfo';
import { PageNumbers } from './PageNumbers';

const PaginationContainer = styled.nav`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaginationControls = styled.ul`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
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
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
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
    <PaginationContainer role="navigation" aria-label="Pagination">
      <PaginationInfo 
        startIndex={startIndex}
        pageSize={pageSize}
        totalItems={totalItems}
      />
      <PaginationControls>
        <li>
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={!canGoFirst}
          aria-label="Go to first page"
        >
          First
        </PaginationButton>
        </li>
        <li>
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
        >
          Previous
        </PaginationButton>
        </li>
        <PageNumbers
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <li>
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
        >
          Next
        </PaginationButton>
        </li>
        <li>
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoLast}
          aria-label="Go to last page"
        >
          Last
        </PaginationButton>
        </li>
      </PaginationControls>
    </PaginationContainer>
  );
};