// Utility functions for store operations

/**
 * Creates a basic loading state handler
 * @param {Function} set - Zustand set function
 * @returns {Object} Loading state actions
 */
export const createLoadingState = (set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
});

/**
 * Creates a basic error state handler
 * @param {Function} set - Zustand set function
 * @returns {Object} Error state actions
 */
export const createErrorState = (set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
});

/**
 * Creates array manipulation helpers for store items
 * @param {Function} set - Zustand set function
 * @param {string} stateKey - The key in state to manipulate
 * @returns {Object} Array manipulation actions
 */
export const createArrayActions = (set, stateKey) => ({
  [`add${capitalize(stateKey.slice(0, -1))}`]: (item) => set((state) => ({
    [stateKey]: [...state[stateKey], item]
  })),
  
  [`update${capitalize(stateKey.slice(0, -1))}`]: (itemId, updatedItem) => set((state) => ({
    [stateKey]: state[stateKey].map(item => 
      item.id === itemId ? { ...item, ...updatedItem } : item
    )
  })),
  
  [`remove${capitalize(stateKey.slice(0, -1))}`]: (itemId) => set((state) => ({
    [stateKey]: state[stateKey].filter(item => item.id !== itemId)
  })),
  
  [`clear${capitalize(stateKey)}`]: () => set({ [stateKey]: [] }),
});

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a toggle action for boolean state
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @param {string} stateKey - The boolean state key to toggle
 * @returns {Function} Toggle function
 */
export const createToggleAction = (set, get, stateKey) => () => {
  set({ [stateKey]: !get()[stateKey] });
};

/**
 * Creates a reset action that returns state to initial values
 * @param {Function} set - Zustand set function
 * @param {Object} initialState - Initial state object
 * @returns {Function} Reset function
 */
export const createResetAction = (set, initialState) => () => {
  set(initialState);
};