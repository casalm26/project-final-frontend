import { useMemo } from 'react';

export const usePagination = ({ currentPage, totalPages, maxVisiblePages = 5 }) => {
  const pageNumbers = useMemo(() => {
    const pages = [];
    
    for (let i = 0; i < Math.min(maxVisiblePages, totalPages); i++) {
      const pageNumber = currentPage - 2 + i;
      if (pageNumber > 0 && pageNumber <= totalPages) {
        pages.push(pageNumber);
      }
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const canGoFirst = currentPage > 1;
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canGoLast = currentPage < totalPages;

  return {
    pageNumbers,
    canGoFirst,
    canGoPrevious,
    canGoNext,
    canGoLast,
  };
};