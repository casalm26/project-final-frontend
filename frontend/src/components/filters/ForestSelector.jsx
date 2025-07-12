import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
`;

const ForestList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
`;

const ForestItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:focus-within {
    background-color: #f0fdf4;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
`;

const ForestInfo = styled.div`
  flex: 1;
`;

const ForestName = styled.div`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`;

const ForestDetails = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const SelectedCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const ForestSelector = ({ 
  onForestChange, 
  forests = [
    { id: 1, name: 'Forest A', region: 'North Region', treeCount: 2500, area: '150 ha' },
    { id: 2, name: 'Forest B', region: 'South Region', treeCount: 3200, area: '200 ha' },
    { id: 3, name: 'Forest C', region: 'East Region', treeCount: 1800, area: '120 ha' },
    { id: 4, name: 'Forest D', region: 'West Region', treeCount: 2750, area: '180 ha' },
    { id: 5, name: 'Forest E', region: 'Central Region', treeCount: 4100, area: '250 ha' }
  ],
  initialSelected = []
}) => {
  const [selectedForests, setSelectedForests] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredForests, setFilteredForests] = useState(forests);

  // Filter forests based on search term
  useEffect(() => {
    const filtered = forests.filter(forest =>
      forest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forest.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForests(filtered);
  }, [searchTerm, forests]);

  // Debounced update effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onForestChange) {
        onForestChange(selectedForests);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [selectedForests, onForestChange]);

  const handleForestToggle = (forestId) => {
    setSelectedForests(prev => {
      if (prev.includes(forestId)) {
        return prev.filter(id => id !== forestId);
      } else {
        return [...prev, forestId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedForests(forests.map(forest => forest.id));
  };

  const handleSelectNone = () => {
    setSelectedForests([]);
  };

  const handleReset = () => {
    setSelectedForests(initialSelected);
    setSearchTerm('');
  };

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterTitle>Forest Selection</FilterTitle>
        <ResetButton onClick={handleReset}>
          Reset
        </ResetButton>
      </FilterHeader>
      
      <SearchInput
        type="text"
        placeholder="Search forests by name or region..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleSelectAll}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded border border-green-200 hover:bg-green-200 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={handleSelectNone}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200 hover:bg-gray-200 transition-colors"
        >
          Select None
        </button>
      </div>
      
      <ForestList>
        {filteredForests.map(forest => (
          <ForestItem key={forest.id}>
            <Checkbox
              type="checkbox"
              checked={selectedForests.includes(forest.id)}
              onChange={() => handleForestToggle(forest.id)}
            />
            <ForestInfo>
              <ForestName>{forest.name}</ForestName>
              <ForestDetails>
                {forest.region} • {forest.treeCount} trees • {forest.area}
              </ForestDetails>
            </ForestInfo>
          </ForestItem>
        ))}
        {filteredForests.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No forests found matching your search.
          </div>
        )}
      </ForestList>
      
      <SelectedCount>
        {selectedForests.length} of {forests.length} forests selected
      </SelectedCount>
    </FilterContainer>
  );
}; 