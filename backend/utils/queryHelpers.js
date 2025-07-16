/**
 * Query building and pagination helper utilities
 */

/**
 * Builds query conditions for user search and filtering
 * @param {Object} queryParams - Query parameters from request
 * @returns {Object} - MongoDB query conditions
 */
export const buildUserQueryConditions = (queryParams) => {
  const { search, role, isActive } = queryParams;
  const queryConditions = {};

  if (search) {
    queryConditions.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  if (role) queryConditions.role = role;
  if (isActive !== undefined) queryConditions.isActive = isActive === 'true';

  return queryConditions;
};

/**
 * Calculates pagination parameters
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination parameters
 */
export const calculatePagination = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit),
    page: parseInt(page)
  };
};

/**
 * Builds pagination metadata
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalCount - Total number of items
 * @returns {Object} - Pagination metadata
 */
export const buildPaginationMetadata = (currentPage, limit, totalCount) => {
  return {
    currentPage: parseInt(currentPage),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    hasNextPage: currentPage * limit < totalCount,
    hasPrevPage: currentPage > 1
  };
};

/**
 * Builds sort parameters for MongoDB queries
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} - MongoDB sort object
 */
export const buildSortParams = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  return { [sortBy]: sortDirection };
};