import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    (set, get) => ({
      sidebarOpen: false,
      darkMode: false,
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setDarkMode: (dark) => {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ darkMode: dark });
      },
      
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ darkMode: newDarkMode });
      },
    }),
    { name: 'ui-store' }
  )
);