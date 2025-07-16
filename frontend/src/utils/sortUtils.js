// Sorting direction constants
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Sort icon constants
export const SORT_ICONS = {
  NONE: '⇅',
  ASC: '↑',
  DESC: '↓'
};

// Default sort configuration
export const DEFAULT_SORT_CONFIG = {
  field: null,
  direction: SORT_DIRECTIONS.DESC
};

// Core sorting icon utilities
export const getSortIcon = (field, sortField, sortDirection) => {
  if (sortField !== field) return SORT_ICONS.NONE;
  return sortDirection === SORT_DIRECTIONS.ASC ? SORT_ICONS.ASC : SORT_ICONS.DESC;
};

export const getSortIconByDirection = (direction) => {
  return direction === SORT_DIRECTIONS.ASC ? SORT_ICONS.ASC : SORT_ICONS.DESC;
};

// Sorting state management utilities
export const getNextSortDirection = (currentField, targetField, currentDirection) => {
  if (currentField !== targetField) {
    return SORT_DIRECTIONS.DESC; // Default to DESC for new fields
  }
  return currentDirection === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
};

export const createSortHandler = (currentField, currentDirection, onSortChange) => {
  return (field) => {
    const newDirection = getNextSortDirection(currentField, field, currentDirection);
    onSortChange(field, newDirection);
  };
};

// Generic sorting function for arrays
export const sortData = (data, field, direction = SORT_DIRECTIONS.ASC) => {
  if (!data || !Array.isArray(data) || !field) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === SORT_DIRECTIONS.ASC ? -1 : 1;
    if (bValue == null) return direction === SORT_DIRECTIONS.ASC ? 1 : -1;
    
    // Handle different data types
    const comparison = compareValues(aValue, bValue);
    return direction === SORT_DIRECTIONS.ASC ? comparison : -comparison;
  });
};

// Helper function to get nested object values (e.g., 'user.name')
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to compare different types of values
const compareValues = (a, b) => {
  // Convert to strings for comparison if they're not numbers or dates
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  
  // String comparison (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  
  if (aStr < bStr) return -1;
  if (aStr > bStr) return 1;
  return 0;
};

// Validation utilities
export const isValidSortDirection = (direction) => {
  return Object.values(SORT_DIRECTIONS).includes(direction);
};

export const isValidSortField = (field, validFields = []) => {
  if (!field || typeof field !== 'string') return false;
  if (validFields.length === 0) return true; // No restrictions
  return validFields.includes(field);
};