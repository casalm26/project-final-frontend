import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export const useTreeNavigation = (currentTreeId, trees) => {
  const navigate = useNavigate();

  const currentIndex = useMemo(() => 
    trees.findIndex(t => t.id === parseInt(currentTreeId)), 
    [trees, currentTreeId]
  );

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < trees.length - 1;

  const handlePreviousTree = useCallback(() => {
    if (hasPrevious) {
      navigate(`/tree/${trees[currentIndex - 1].id}`);
    }
  }, [navigate, trees, currentIndex, hasPrevious]);

  const handleNextTree = useCallback(() => {
    if (hasNext) {
      navigate(`/tree/${trees[currentIndex + 1].id}`);
    }
  }, [navigate, trees, currentIndex, hasNext]);

  return {
    hasPrevious,
    hasNext,
    handlePreviousTree,
    handleNextTree,
    currentIndex
  };
};