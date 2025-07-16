import styled from 'styled-components';

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const FiltersSubtitle = styled.p`
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
`;

const ClearAllButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #dc2626;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

export const FilterHeader = ({ hasActiveFilters, onClearAll }) => {
  return (
    <FiltersHeader>
      <div>
        <FiltersTitle>Global Filters</FiltersTitle>
        <FiltersSubtitle>
          Filter your data by date range and forest selection
        </FiltersSubtitle>
      </div>
      {hasActiveFilters && (
        <ClearAllButton onClick={onClearAll}>
          Clear All
        </ClearAllButton>
      )}
    </FiltersHeader>
  );
};