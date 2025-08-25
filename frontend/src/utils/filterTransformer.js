/**
 * Transform filters from GlobalFilters format to API format
 * 
 * GlobalFilters format:
 * {
 *   dateRange: { startDate: Date, endDate: Date },
 *   selectedForests: [1, 2, 3]
 * }
 * 
 * API format:
 * {
 *   startDate: "2024-01-01",
 *   endDate: "2024-12-31",
 *   forestIds: "1,2,3"
 * }
 */

/**
 * Format a Date object to ISO string date (YYYY-MM-DD)
 * @param {Date} date - Date object to format
 * @returns {string|null} Formatted date string or null
 */
const formatDateToISO = (date) => {
  if (!date) return null;
  
  try {
    // Handle both Date objects and strings
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // Format as YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

/**
 * Transform filters from GlobalFilters component format to API format
 * @param {Object} filters - Filters from GlobalFilters component
 * @returns {Object} Transformed filters for API
 */
export const transformFiltersForAPI = (filters = {}) => {
  const apiFilters = {};
  
  // Handle date range
  if (filters.dateRange) {
    const { startDate, endDate } = filters.dateRange;
    
    if (startDate) {
      apiFilters.startDate = formatDateToISO(startDate);
    }
    
    if (endDate) {
      apiFilters.endDate = formatDateToISO(endDate);
    }
  }
  
  // Handle selected forests
  if (filters.selectedForests && Array.isArray(filters.selectedForests)) {
    if (filters.selectedForests.length > 0) {
      // Convert array to comma-separated string
      apiFilters.forestIds = filters.selectedForests.join(',');
    }
  }
  
  // Pass through any additional filters that might be added in the future
  // (e.g., species, health status, etc.)
  const { dateRange, selectedForests, ...otherFilters } = filters;
  Object.assign(apiFilters, otherFilters);
  
  return apiFilters;
};

/**
 * Transform filters for display purposes (inverse of transformFiltersForAPI)
 * @param {Object} apiFilters - Filters from API
 * @returns {Object} Transformed filters for GlobalFilters component
 */
export const transformFiltersFromAPI = (apiFilters = {}) => {
  const filters = {};
  
  // Handle date range
  if (apiFilters.startDate || apiFilters.endDate) {
    filters.dateRange = {};
    
    if (apiFilters.startDate) {
      filters.dateRange.startDate = new Date(apiFilters.startDate);
    }
    
    if (apiFilters.endDate) {
      filters.dateRange.endDate = new Date(apiFilters.endDate);
    }
  }
  
  // Handle forest IDs
  if (apiFilters.forestIds) {
    // Convert comma-separated string to array of numbers
    filters.selectedForests = apiFilters.forestIds
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
  } else if (apiFilters.forestId) {
    // Handle single forest ID (backward compatibility)
    const forestId = parseInt(apiFilters.forestId, 10);
    if (!isNaN(forestId)) {
      filters.selectedForests = [forestId];
    }
  }
  
  // Pass through any additional filters
  const { startDate, endDate, forestIds, forestId, ...otherFilters } = apiFilters;
  Object.assign(filters, otherFilters);
  
  return filters;
};