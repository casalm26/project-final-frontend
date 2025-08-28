/**
 * Utility functions for filter validation
 */

// Validation constants
export const VALIDATION_LIMITS = {
  MAX_DATE_RANGE_YEARS: 5,
  MAX_SELECTED_FORESTS: 10,
  MILLISECONDS_PER_YEAR: 1000 * 60 * 60 * 24 * 365
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  DATE_ORDER: 'Start date must be before or equal to end date',
  DATE_FUTURE: 'End date cannot be in the future',
  DATE_RANGE_TOO_LARGE: `Date range cannot exceed ${VALIDATION_LIMITS.MAX_DATE_RANGE_YEARS} years`,
  TOO_MANY_FORESTS: `Cannot select more than ${VALIDATION_LIMITS.MAX_SELECTED_FORESTS} forests at once`
};

/**
 * Validates date range filter
 * @param {Object} dateRange - The date range to validate
 * @param {Date} dateRange.startDate - Start date
 * @param {Date} dateRange.endDate - End date
 * @returns {string|null} Error message or null if valid
 */
export const validateDateRange = (dateRange) => {
  if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
    return null;
  }
  
  const { startDate, endDate } = dateRange;
  
  if (startDate > endDate) {
    return VALIDATION_MESSAGES.DATE_ORDER;
  }
  
  if (endDate > new Date()) {
    return VALIDATION_MESSAGES.DATE_FUTURE;
  }
  
  // Check if date range is too large
  const diffYears = (endDate - startDate) / VALIDATION_LIMITS.MILLISECONDS_PER_YEAR;
  if (diffYears > VALIDATION_LIMITS.MAX_DATE_RANGE_YEARS) {
    return VALIDATION_MESSAGES.DATE_RANGE_TOO_LARGE;
  }
  
  return null;
};

/**
 * Validates selected forests filter
 * @param {Array} selectedForests - Array of selected forest IDs
 * @returns {string|null} Error message or null if valid
 */
export const validateSelectedForests = (selectedForests) => {
  if (!selectedForests || !Array.isArray(selectedForests)) {
    return null;
  }
  
  if (selectedForests.length > VALIDATION_LIMITS.MAX_SELECTED_FORESTS) {
    return VALIDATION_MESSAGES.TOO_MANY_FORESTS;
  }
  
  return null;
};

/**
 * Validates filter values and returns validation errors
 * @param {Object} filters - The filters object to validate
 * @param {Object} filters.dateRange - Date range filter
 * @param {Array} filters.selectedForests - Selected forests filter
 * @returns {Object} Object containing validation errors, empty if valid
 */
export const validateFilters = (filters) => {
  const errors = {};

  // Validate date range
  const dateRangeError = validateDateRange(filters.dateRange);
  if (dateRangeError) {
    errors.dateRange = dateRangeError;
  }

  // Validate selected forests
  const forestsError = validateSelectedForests(filters.selectedForests);
  if (forestsError) {
    errors.selectedForests = forestsError;
  }

  return errors;
};

/**
 * Checks if filters are valid (no validation errors)
 * @param {Object} filters - The filters object to validate
 * @returns {boolean} True if filters are valid, false otherwise
 */
export const areFiltersValid = (filters) => {
  const errors = validateFilters(filters);
  return Object.keys(errors).length === 0;
};

/**
 * Creates default filter values
 * @returns {Object} Default filter configuration
 */
export const createDefaultFilters = () => ({
  dateRange: {
    startDate: null,
    endDate: null
  },
  selectedForests: []
});

/**
 * Creates default filter values in store format
 * @returns {Object} Default filter configuration for store
 */
export const createDefaultStoreFilters = () => ({
  dateRange: { start: null, end: null },
  forests: [],
  regions: [],
  species: [],
  status: 'all',
  soilCondition: '',
  sunlightExposure: '',
  search: ''
});