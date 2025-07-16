import { handleValidationErrors, validateSelfAction } from '../utils/validationHelpers.js';
import { sendSuccessResponse, sendErrorResponse, sendNotFoundResponse, sendBadRequestResponse } from '../utils/responseHelpers.js';
import { buildUserQueryConditions, calculatePagination, buildPaginationMetadata, buildSortParams } from '../utils/queryHelpers.js';
import { fetchPaginatedUsers, fetchUserWithStatistics, createNewUser, updateUserFields, deleteUserAndTokens, revokeAllUserTokens, calculateUserStatistics } from '../utils/userHelpers.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const queryConditions = buildUserQueryConditions({ search, role, isActive });
    const sortParams = buildSortParams(sortBy, sortOrder);
    const { skip, limit: parsedLimit, page: parsedPage } = calculatePagination(page, limit);

    const { users, totalCount } = await fetchPaginatedUsers(queryConditions, sortParams, skip, parsedLimit);
    const pagination = buildPaginationMetadata(parsedPage, parsedLimit, totalCount);

    sendSuccessResponse(res, { users, pagination });
  } catch (error) {
    console.error('Get all users error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await fetchUserWithStatistics(id);
    if (!result) {
      return sendNotFoundResponse(res, 'User');
    }

    sendSuccessResponse(res, result);
  } catch (error) {
    console.error('Get user by ID error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    if (!handleValidationErrors(req, res)) {
      return;
    }

    const { email, password, firstName, lastName, role = 'user' } = req.body;
    const result = await createNewUser({ email, password, firstName, lastName, role });

    if (!result.success) {
      return sendErrorResponse(res, result.message, result.statusCode);
    }

    sendSuccessResponse(res, { user: result.user }, 'User created successfully', 201);
  } catch (error) {
    console.error('Create user error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    if (!handleValidationErrors(req, res)) {
      return;
    }

    const { id } = req.params;
    const { firstName, lastName, role, isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (isActive === false) {
      const selfActionError = validateSelfAction(req.user._id.toString(), id, 'deactivate');
      if (selfActionError) {
        return sendBadRequestResponse(res, selfActionError.message);
      }
    }

    const result = await updateUserFields(id, { firstName, lastName, role, isActive });

    if (!result.success) {
      return sendErrorResponse(res, result.message, result.statusCode);
    }

    sendSuccessResponse(res, { user: result.user }, 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    const selfActionError = validateSelfAction(req.user._id.toString(), id, 'delete');
    if (selfActionError) {
      return sendBadRequestResponse(res, selfActionError.message);
    }

    const result = await deleteUserAndTokens(id);

    if (!result.success) {
      return sendErrorResponse(res, result.message, result.statusCode);
    }

    sendSuccessResponse(res, null, result.message);
  } catch (error) {
    console.error('Delete user error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Revoke all refresh tokens for a user (admin only)
export const revokeUserTokens = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await revokeAllUserTokens(id);

    if (!result.success) {
      return sendErrorResponse(res, result.message, result.statusCode);
    }

    sendSuccessResponse(res, { revokedCount: result.revokedCount }, 'All refresh tokens revoked successfully');
  } catch (error) {
    console.error('Revoke user tokens error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};

// Get user statistics (admin only)
export const getUserStatistics = async (req, res) => {
  try {
    const statistics = await calculateUserStatistics();
    sendSuccessResponse(res, statistics);
  } catch (error) {
    console.error('Get user statistics error:', error);
    sendErrorResponse(res, 'Internal server error', 500, error.message);
  }
};