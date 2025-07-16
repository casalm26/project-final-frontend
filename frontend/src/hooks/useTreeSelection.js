import { useState, useCallback } from 'react';

export const useTreeSelection = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTreeSelect = useCallback((tree) => {
    setSelectedTree(tree);
    setIsModalOpen(true);
  }, []);

  const handleCloseTreeDetail = useCallback(() => {
    setSelectedTree(null);
    setIsModalOpen(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTree(null);
    setIsModalOpen(false);
  }, []);

  return {
    selectedTree,
    isModalOpen,
    handleTreeSelect,
    handleCloseTreeDetail,
    clearSelection
  };
};