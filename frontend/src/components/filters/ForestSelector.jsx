import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { forestAPI } from '../../lib/api';

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
  selectedForests = [],
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [forests, setForests] = useState([]);
  const [filteredForests, setFilteredForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch forests from API on component mount
  useEffect(() => {
    const fetchForests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await forestAPI.getAll();
        
        // Transform the forest data to match our component's expectations
        const transformedForests = response.data.forests.map(forest => ({
          id: forest.id,
          name: forest.name,
          region: forest.region,
          treeCount: forest.treeCount || 0,
          area: `${Math.round(forest.area)} ha`,
          areaNumeric: forest.area, // Store numeric value for sorting if needed
          isActive: forest.isActive
        })).filter(forest => forest.isActive); // Only show active forests
        
        setForests(transformedForests);
      } catch (err) {
        console.error('Error fetching forests:', err);
        setError('Failed to load forests');
        setForests([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchForests();
  }, []);

  // Filter forests based on search term
  useEffect(() => {
    const filtered = forests.filter(forest =>
      forest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forest.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForests(filtered);
  }, [searchTerm, forests]);

  const handleForestToggle = (forestId) => {
    if (onChange) {
      if (selectedForests.includes(forestId)) {
        onChange(selectedForests.filter(id => id !== forestId));
      } else {
        onChange([...selectedForests, forestId]);
      }
    }
  };

  const handleSelectAll = () => {
    if (onChange) {
      onChange(forests.map(forest => forest.id));
    }
  };

  const handleSelectNone = () => {
    if (onChange) {
      onChange([]);
    }
  };

  const handleReset = () => {
    if (onChange) {
      onChange([]);
    }
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
      
      {loading ? (
        <div className="p-4 text-center">
          <div className="text-sm text-gray-500">Loading forests...</div>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <div className="text-sm text-red-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
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
            {filteredForests.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500 text-sm">
                {forests.length === 0 ? 'No forests available.' : 'No forests found matching your search.'}
              </div>
            )}
          </ForestList>
        </>
      )}
      
      <SelectedCount>
        {selectedForests.length} of {forests.length} forests selected
      </SelectedCount>
    </FilterContainer>
  );
}; 