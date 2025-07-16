import { useState, useCallback } from 'react';

export const useSidebarState = (initialState = false) => {
  const [sidebarOpen, setSidebarOpen] = useState(initialState);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return {
    sidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar
  };
};