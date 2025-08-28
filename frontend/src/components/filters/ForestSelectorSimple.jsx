import { useState, useEffect } from 'react';
import { forestAPI } from '../../lib/api';

export const ForestSelector = ({ selectedForests = [], onChange, error }) => {
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchForests = async () => {
      try {
        const response = await forestAPI.getAll();
        setForests(response.data?.forests || response.data || []);
      } catch (error) {
        console.error('Error fetching forests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForests();
  }, []);

  const handleForestToggle = (forestId) => {
    const newSelection = selectedForests.includes(forestId)
      ? selectedForests.filter(id => id !== forestId)
      : [...selectedForests, forestId];
    
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = forests.map(f => f._id);
    onChange(allIds);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm flex justify-between items-center"
      >
        <span className="truncate">
          {selectedForests.length === 0 
            ? 'Select forests...'
            : selectedForests.length === 1
            ? `1 forest selected`
            : `${selectedForests.length} forests selected`
          }
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {forests.map((forest) => (
            <label
              key={forest._id}
              className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedForests.includes(forest._id)}
                onChange={() => handleForestToggle(forest._id)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-white truncate">
                {forest.name}
              </span>
            </label>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};